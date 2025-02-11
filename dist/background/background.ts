interface BlockStats {
  totalBlocked: number;
  byDomain: {
    [domain: string]: number;
  };
  byType: {
    [type: string]: number;
  };
  timestamp: number;
}

// Initialize extension with proper rule setup
chrome.runtime.onInstalled.addListener(async () => {
  console.log("[AdFriend] Extension installed/updated");

  // Initialize storage with default values
  await chrome.storage.sync.set({
    blockedCount: 0,
    enabled: true,
    blockStats: {
      totalBlocked: 0,
      byDomain: {},
      byType: {},
      timestamp: Date.now(),
    },
  });

  try {
    // First, get and remove all existing rules
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = existingRules.map((rule) => rule.id);

    // Update rules: remove old ones and add new ones
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingRuleIds,
      addRules: [
        {
          id: 100, // Using higher IDs to avoid conflicts
          priority: 1,
          action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
          condition: {
            urlFilter: "*doubleclick.net/*",
            resourceTypes: [
              chrome.declarativeNetRequest.ResourceType.SCRIPT,
              chrome.declarativeNetRequest.ResourceType.IMAGE,
              chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
              chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
            ],
          },
        },
        {
          id: 101,
          priority: 1,
          action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
          condition: {
            urlFilter: "*googlesyndication.com/*",
            resourceTypes: [
              chrome.declarativeNetRequest.ResourceType.SCRIPT,
              chrome.declarativeNetRequest.ResourceType.IMAGE,
              chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
              chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
            ],
          },
        },
        {
          id: 102,
          priority: 1,
          action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
          condition: {
            urlFilter: "*google-analytics.com/*",
            resourceTypes: [
              chrome.declarativeNetRequest.ResourceType.SCRIPT,
              chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
            ],
          },
        },
        {
          id: 103,
          priority: 1,
          action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
          condition: {
            urlFilter: "*ads.*/*",
            resourceTypes: [
              chrome.declarativeNetRequest.ResourceType.SCRIPT,
              chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
              chrome.declarativeNetRequest.ResourceType.IMAGE,
            ],
          },
        },
      ],
    });

    console.log("[AdFriend] Rules initialized successfully");
  } catch (error) {
    console.error("[AdFriend] Error initializing rules:", error);
  }
});

// Function to update rules based on enabled state
async function updateRules(enabled: boolean) {
  try {
    if (enabled) {
      // Enable blocking rules
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: ["ruleset_1"],
      });
      console.log("[AdFriend] Blocking rules enabled");
    } else {
      // Disable blocking rules
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: ["ruleset_1"],
      });
      // Notify all tabs to remove inspirational content
      const tabs = await chrome.tabs.query({});
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, { type: "DISABLE_ADFRIEND" });
        }
      });
      console.log("[AdFriend] Blocking rules disabled");
    }
  } catch (error) {
    console.error("[AdFriend] Error updating rules:", error);
  }
}

// Listen for storage changes to handle enable/disable
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.enabled) {
    const isEnabled = changes.enabled.newValue;
    console.log("[AdFriend] Extension " + (isEnabled ? "enabled" : "disabled"));

    if (!isEnabled) {
      chrome.action.setBadgeText({ text: "OFF" });
      chrome.action.setBadgeBackgroundColor({ color: "#6b7280" });
    } else {
      chrome.storage.sync.get(["blockedCount"], (result) => {
        const count = result.blockedCount || 0;
        chrome.action.setBadgeText({ text: count.toString() });
        chrome.action.setBadgeBackgroundColor({ color: "#22c55e" });
      });
    }
  }
});

// Function to extract domain from URL
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
}

// Function to update badge with animation
function updateBadgeWithAnimation(count: number) {
  const colors = ["#22c55e", "#16a34a", "#15803d"];
  let colorIndex = 0;

  const animate = () => {
    if (colorIndex < colors.length) {
      chrome.action.setBadgeBackgroundColor({ color: colors[colorIndex] });
      chrome.action.setBadgeText({ text: count.toString() });
      colorIndex++;
      setTimeout(animate, 100);
    }
  };

  animate();
}

// Listen for rule matches only when enabled
chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener(
  async ({ request }) => {
    const { enabled } = await chrome.storage.sync.get("enabled");
    if (!enabled) return;

    // Don't count main frame requests
    if (request.type === "main_frame") return;

    // Increment counter when an ad request is blocked
    chrome.storage.sync.get(["blockedCount"], (result) => {
      const newBlockedCount = (result.blockedCount || 0) + 1;
      chrome.storage.sync.set({ blockedCount: newBlockedCount });
      chrome.action.setBadgeText({ text: newBlockedCount.toString() });
    });
  }
);

// Reset daily stats at midnight
setInterval(async () => {
  const { blockStats } = await chrome.storage.sync.get("blockStats");
  const now = Date.now();
  const lastReset = new Date(blockStats.timestamp);
  const today = new Date();

  if (lastReset.getDate() !== today.getDate()) {
    console.log("[AdFriend] Resetting daily stats");
    await chrome.storage.sync.set({
      blockStats: {
        totalBlocked: blockStats.totalBlocked, // Keep total
        byDomain: {}, // Reset daily domains
        byType: {}, // Reset daily types
        timestamp: now,
      },
    });
  }
}, 60000); // Check every minute

// Listen for startup
chrome.runtime.onStartup.addListener(async () => {
  const { enabled } = await chrome.storage.sync.get("enabled");
  updateRules(enabled);

  if (enabled) {
    const { blockedCount = 0 } = await chrome.storage.sync.get("blockedCount");
    chrome.action.setBadgeText({ text: blockedCount.toString() });
  }
});
