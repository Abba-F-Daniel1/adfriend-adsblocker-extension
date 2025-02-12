document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggleButton");
  const blockedCountElement = document.getElementById("blockedCount");
  const dataSavedElement = document.getElementById("dataSaved");
  const energySavedElement = document.getElementById("energySaved");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const statusMessage = document.querySelector(".status-message");
  let blockingChart;

  console.log("Popup opened, blockedCountElement:", blockedCountElement);

  // Function to update count display with animation
  function updateCountDisplay(blockedCount) {
    console.log("Updating count display with value:", blockedCount);
    if (blockedCountElement) {
      // Ensure we're working with a number
      const count = parseInt(blockedCount) || 0;
      console.log("Parsed count:", count);
      // Format the number with commas for better readability
      blockedCountElement.textContent = count.toLocaleString();
      // Add animation
      blockedCountElement.style.animation = "none";
      blockedCountElement.offsetHeight; // Trigger reflow
      blockedCountElement.style.animation = "pulse 0.3s ease-in-out";
    } else {
      console.error("blockedCountElement not found");
    }
  }

  // Initialize Chart.js
  function initializeChart() {
    const ctx = document.getElementById("blockingGraph").getContext("2d");
    blockingChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`),
        datasets: [
          {
            label: "Ads Blocked",
            data: [0, 0, 0, 0, 0, 0, 0],
            borderColor: "#2563eb",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  // Calculate impact metrics
  function updateImpactMetrics(blockedCount) {
    // Rough estimates: 1 ad = 100KB data and 0.0002 kWh energy
    const dataSaved = ((blockedCount * 100) / 1024).toFixed(2); // Convert to MB
    const energySaved = (blockedCount * 0.0002).toFixed(3);

    dataSavedElement.textContent = `${dataSaved} MB`;
    energySavedElement.textContent = `${energySaved} kWh`;
  }

  // Function to update UI state
  function updateUIState(isEnabled) {
    if (isEnabled) {
      toggleButton.classList.add("enabled");
      toggleButton.classList.remove("disabled");
      toggleButton.textContent = "Enabled";
      statusMessage.textContent = "Actively blocking ads and trackers";
    } else {
      toggleButton.classList.remove("enabled");
      toggleButton.classList.add("disabled");
      toggleButton.textContent = "Disabled";
      statusMessage.textContent = "Protection is currently paused";
      // Clear the badge count when disabled
      chrome.action.setBadgeText({ text: "" });
    }
  }

  // Function to toggle extension rules
  async function toggleExtension(enable) {
    try {
      if (enable) {
        // Enable blocking by adding rules
        await chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: [], // Keep any existing rules
          addRules: [
            {
              id: 1,
              priority: 1,
              action: {
                type: chrome.declarativeNetRequest.RuleActionType.BLOCK,
              },
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
              id: 2,
              priority: 1,
              action: {
                type: chrome.declarativeNetRequest.RuleActionType.BLOCK,
              },
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
          ],
        });

        // Restore the last count when enabled
        const { blockedCount = 0 } = await chrome.storage.sync.get(
          "blockedCount"
        );
        chrome.action.setBadgeText({ text: blockedCount.toString() });
        chrome.action.setBadgeBackgroundColor({ color: "#22c55e" });
      } else {
        // Disable blocking by removing all rules
        const rules = await chrome.declarativeNetRequest.getDynamicRules();
        const ruleIds = rules.map((rule) => rule.id);
        await chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: ruleIds,
          addRules: [],
        });
      }

      // Update storage
      await chrome.storage.sync.set({ enabled: enable });

      // Update UI
      updateUIState(enable);
      console.log(`Extension ${enable ? "enabled" : "disabled"} successfully`);
    } catch (error) {
      console.error("Error toggling extension:", error);
    }
  }

  // Toggle button click handler
  toggleButton.addEventListener("click", async () => {
    const isCurrentlyEnabled = toggleButton.classList.contains("enabled");
    const newState = !isCurrentlyEnabled;

    try {
      // Update storage state
      await chrome.storage.sync.set({ enabled: newState });

      // Update UI
      updateUIState(newState);

      // Send message to all tabs to update content immediately
      const tabs = await chrome.tabs.query({ active: true });
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: newState ? "ENABLE_ADFRIEND" : "DISABLE_ADFRIEND",
          });
        }
      });

      // Update badge
      if (!newState) {
        chrome.action.setBadgeText({ text: "OFF" });
        chrome.action.setBadgeBackgroundColor({ color: "#6b7280" });
      } else {
        const { blockedCount = 0 } = await chrome.storage.sync.get(
          "blockedCount"
        );
        chrome.action.setBadgeText({ text: blockedCount.toString() });
        chrome.action.setBadgeBackgroundColor({ color: "#22c55e" });
      }
    } catch (error) {
      console.error("Error toggling extension:", error);
    }
  });

  // Dark mode toggle
  darkModeToggle.addEventListener("change", (e) => {
    const isDark = e.target.checked;
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );
    chrome.storage.sync.set({ darkMode: isDark });
  });

  // Load initial state
  chrome.storage.sync.get(["enabled", "darkMode"], async (result) => {
    const isEnabled = result.enabled ?? true;
    const isDark = result.darkMode ?? false;

    // Set initial UI state
    updateUIState(isEnabled);

    // Ensure rules match stored state
    await toggleExtension(isEnabled);

    // Set dark mode
    darkModeToggle.checked = isDark;
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );

    // Load initial state and counts
    console.log("Fetching initial count from storage");
    chrome.storage.sync.get(["blockedCount", "blockingHistory"], (result) => {
      console.log("Storage result:", result);
      const blockedCount = result.blockedCount || 0;
      const blockingHistory = result.blockingHistory || Array(7).fill(0);

      updateCountDisplay(blockedCount);
      updateImpactMetrics(blockedCount);
      initializeChart();

      // Update chart with actual history data
      if (blockingChart) {
        blockingChart.data.datasets[0].data = blockingHistory;
        blockingChart.update();
      }
    });
  });

  // Listen for updates from background script
  chrome.runtime.onMessage.addListener((message) => {
    console.log("Received message:", message);
    if (message.type === "updateCounts") {
      const newCount = message.blockedCount;
      updateCountDisplay(newCount);
      updateImpactMetrics(newCount);

      // Update chart with new data point
      if (blockingChart && message.blockingHistory) {
        blockingChart.data.datasets[0].data = message.blockingHistory;
        blockingChart.update();
      }

      // Update button state while preserving the count
      updateUIState(toggleButton.classList.contains("enabled"));
    }
  });
});
