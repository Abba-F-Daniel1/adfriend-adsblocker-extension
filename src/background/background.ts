// Initialize storage and rules
chrome.runtime.onInstalled.addListener(async () => {
  console.log("[AdFriend] Extension installed/updated");

  // Initialize chrome.storage
  await chrome.storage.sync.set({
    blockedCount: 0,
    enabled: true,
  });

  console.log("[AdFriend] Storage initialized");

  // Set extension action options
  await chrome.declarativeNetRequest.setExtensionActionOptions({
    displayActionCountAsBadgeText: true,
  });
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
    updateRules(isEnabled);

    if (!isEnabled) {
      chrome.action.setBadgeText({ text: "" });
    } else {
      chrome.storage.sync.get(["blockedCount"], (result) => {
        const count = result.blockedCount || 0;
        chrome.action.setBadgeText({ text: count.toString() });
      });
    }
  }
});

// Listen for rule matches only when enabled
chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener(
  async ({ request }) => {
    const { enabled } = await chrome.storage.sync.get("enabled");
    if (!enabled) return;

    if (request.type === "main_frame") return;

    chrome.storage.sync.get(["blockedCount"], (result) => {
      const newBlockedCount = (result.blockedCount || 0) + 1;
      chrome.storage.sync.set({ blockedCount: newBlockedCount });
      chrome.action.setBadgeText({ text: newBlockedCount.toString() });
    });
  }
);

// Listen for startup
chrome.runtime.onStartup.addListener(async () => {
  const { enabled } = await chrome.storage.sync.get("enabled");
  updateRules(enabled);

  if (enabled) {
    const { blockedCount = 0 } = await chrome.storage.sync.get("blockedCount");
    chrome.action.setBadgeText({ text: blockedCount.toString() });
  }
});
