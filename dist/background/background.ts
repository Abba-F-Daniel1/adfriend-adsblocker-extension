// Initialize storage and rules
chrome.runtime.onInstalled.addListener(async () => {
  // Initialize chrome.storage
  await chrome.storage.sync.set({ 
    blockedCount: 0, 
    transformedCount: 0,
    blockingHistory: Array(7).fill(0)
  });
  await chrome.storage.local.set({ blockedAds: [] });

  // Set extension action options
  await chrome.declarativeNetRequest.setExtensionActionOptions({
    displayActionCountAsBadgeText: true
  });
});

// Single listener for blocked requests
chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener(
  ({ request, rule }) => {
    // Ignore main frame blocks to avoid counting page loads
    if (request.type === 'main_frame') return;

    console.debug(`[AdFriend] Blocked ad request to: ${request.url}`);
    console.debug(`[AdFriend] Matched rule: ${rule.ruleId}`);

    // Use chrome.storage for storing counts
    chrome.storage.sync.get(['blockedCount', 'transformedCount', 'blockingHistory'], (result) => {
      const currentCount = result.blockedCount || 0;
      const newBlockedCount = currentCount + 1;
      
      // Update blocking history
      const history = result.blockingHistory || Array(7).fill(0);
      history[6] = newBlockedCount; // Update today's count
      
      chrome.storage.sync.set({ 
        blockedCount: newBlockedCount,
        blockingHistory: history
      }, () => {
        if (chrome.runtime.lastError) {
          console.error('[AdFriend] Error updating blocked count:', chrome.runtime.lastError);
          return;
        }
        // Notify popup to update display only after storage is updated
        try {
          chrome.runtime.sendMessage({
            type: 'updateCounts',
            blockedCount: newBlockedCount,
            transformedCount: result.transformedCount || 0
          });
        } catch (messageError) {
          console.debug('[AdFriend] Popup not ready for message');
        }

        // Store analytics data
        const analyticsData = {
          url: request.url,
          ruleId: rule.ruleId,
          timestamp: new Date().toISOString(),
          type: 'blocked',
          details: {
            initiator: request.initiator || 'unknown',
            frameId: request.frameId,
            resourceType: request.type || 'unknown',
            isAdResource: true
          }
        };

        // Use callback-based storage for analytics
        chrome.storage.local.get('blockedAds', (data) => {
          const blockedAds = data.blockedAds || [];
          blockedAds.push(analyticsData);
          
          // Keep only the last 1000 entries
          if (blockedAds.length > 1000) {
            blockedAds.shift();
          }

          chrome.storage.local.set({ blockedAds });
        });
      });
    });
  }
);