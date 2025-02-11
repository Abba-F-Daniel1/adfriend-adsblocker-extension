import { adPatterns } from '../utils/adPatterns';
import type { Message, ContentType } from '../types';
import type { RuleActionType, ResourceType } from '../types';

type DynamicRule = chrome.declarativeNetRequest.Rule;

const contentTypes: ContentType[] = ['quote', 'fact', 'reminder'];

// Initialize and manage dynamic rules
async function initializeRules() {
  try {
    // Get existing rules to remove them
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = existingRules.map(rule => rule.id);

    // Create new rules from patterns
    const newRules: DynamicRule[] = adPatterns.map((pattern, index) => ({
      id: 1000 + index,
      priority: 1,
      action: { type: 'block' as RuleActionType },
      condition: {
        urlFilter: pattern,
        resourceTypes: ['script', 'image', 'xmlhttprequest', 'sub_frame', 'main_frame'] as ResourceType[]
      }
    }));

    // Update rules
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingRuleIds,
      addRules: newRules
    });

    console.debug(`[AdFriend] Successfully initialized ${newRules.length} blocking rules`);
  } catch (error) {
    console.error('[AdFriend] Error initializing rules:', error);
  }
}

// Initialize rules when extension loads
initializeRules();

// Listen for content script initialization and blocked requests
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  try {
    if (message.type === 'CONTENT_SCRIPT_READY') {
      // Select a random content type for the replacement
      const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
      sendResponse({ 
        type: 'BACKGROUND_READY',
        payload: {
          contentType: randomType
        }
      });

      // Initialize analytics storage
      chrome.storage.local.get('blockedAds', (data) => {
        if (!data.blockedAds) {
          chrome.storage.local.set({ blockedAds: [] });
        }
      });
    }
    return true; // Keep the message channel open for async response
  } catch (error) {
    console.error('[AdFriend] Error processing message:', error);
    sendResponse({ type: 'ERROR', payload: { error: 'Internal error occurred' } });
    return false;
  }
});

// Initialize counters in storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['blockedCount', 'transformedCount'], (result) => {
    if (typeof result.blockedCount === 'undefined') {
      chrome.storage.sync.set({ blockedCount: 0 });
    }
    if (typeof result.transformedCount === 'undefined') {
      chrome.storage.sync.set({ transformedCount: 0 });
    }
  });
});

// Monitor blocked requests for analytics using recommended API
chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener(
  ({ request, rule }) => {
    try {
      console.debug(`[AdFriend] Blocked ad request to: ${request.url}`);
      console.debug(`[AdFriend] Matched rule: ${rule.ruleId}`);

      // Increment blocked count
      chrome.storage.sync.get(['blockedCount'], (result) => {
        const newCount = (result.blockedCount || 0) + 1;
        chrome.storage.sync.set({ blockedCount: newCount }, () => {
          // Notify popup to update display
          chrome.runtime.sendMessage({
            type: 'updateCounts',
            blockedCount: newCount
          });
        });
      });

      // Store analytics data
      chrome.storage.local.set({
        [`blocked_${Date.now()}`]: {
          url: request.url,
          ruleId: rule.ruleId,
          timestamp: new Date().toISOString()
        }
      }).catch(console.error);
    } catch (error) {
      console.error('[AdFriend] Error processing blocked request:', error);
    }
  }
);

// Listen for ad space transformations
chrome.runtime.onMessage.addListener((message: Message) => {
  if (message.type === 'AD_TRANSFORMED') {
    chrome.storage.sync.get(['transformedCount'], (result) => {
      const newCount = (result.transformedCount || 0) + 1;
      chrome.storage.sync.set({ transformedCount: newCount }, () => {
        // Notify popup to update display
        chrome.runtime.sendMessage({
          type: 'updateCounts',
          transformedCount: newCount
        });
      });
    });
  }
  return true; // Keep the message channel open for async operations
});