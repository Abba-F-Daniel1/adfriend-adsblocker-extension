import React from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import type { Message, ContentType, Quote, Fact, Reminder } from '../types';

const contentTypes: ContentType[] = ['quote', 'fact', 'reminder'];

const ContentWidget: React.FC<{ type: ContentType }> = ({ type }) => {
  const [content, setContent] = React.useState<Quote | Fact | Reminder | null>(null);

  React.useEffect(() => {
    const mockContent: Record<ContentType, Quote | Fact | Reminder> = {
      quote: {
        text: Math.random() > 0.5 ? 
          "The only way to do great work is to love what you do." :
          "Innovation distinguishes between a leader and a follower.",
        author: Math.random() > 0.5 ? "Steve Jobs" : "Albert Einstein"
      },
      fact: {
        category: "Science",
        text: Math.random() > 0.5 ?
          "The human brain can process images in as little as 13 milliseconds." :
          "Light travels at a speed of 299,792 kilometers per second."
      },
      reminder: {
        title: Math.random() > 0.5 ? "Learning Break" : "Wellness Check",
        description: Math.random() > 0.5 ?
          "Take 5 minutes to review what you've learned today." :
          "Stand up and stretch for better circulation.",
        type: Math.random() > 0.5 ? "learning" : "health" as const
      }
    };

    setContent(mockContent[type]);
  }, [type]);

  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-white rounded-lg shadow-lg max-w-sm mx-auto"
    >
      {type === 'quote' && (
        <div className="space-y-2">
          <motion.p 
            className="text-lg font-medium text-gray-800"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            "{(content as Quote).text}"
          </motion.p>
          <p className="text-sm text-gray-600">- {(content as Quote).author}</p>
        </div>
      )}

      {type === 'fact' && (
        <div className="space-y-2">
          <motion.div
            className="text-sm font-medium text-blue-600 mb-1"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            {(content as Fact).category}
          </motion.div>
          <p className="text-gray-800">{(content as Fact).text}</p>
        </div>
      )}

      {type === 'reminder' && (
        <div className="space-y-2">
          <motion.h3 
            className="text-lg font-semibold text-gray-800"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            {(content as Reminder).title}
          </motion.h3>
          <p className="text-gray-600">{(content as Reminder).description}</p>
          <span className="inline-block px-2 py-1 text-sm text-white bg-green-500 rounded">
            {(content as Reminder).type}
          </span>
        </div>
      )}
    </motion.div>
  )
};

// Initialize content script
chrome.runtime.sendMessage({ type: 'CONTENT_SCRIPT_READY' } as Message);

// Set up MutationObserver for dynamic ad detection with improved selectors and performance
const adSelectors = [
  // Basic ad patterns with more specific targeting
  '[id^="ad-"],[id^="ads-"],[class^="ad-"],[class^="ads-"]',
  '[id*="advertisement"],[class*="advertisement"]',
  '[id*="banner-ad"],[class*="banner-ad"]',
  '[id*="sponsored-"],[class*="sponsored-"]',
  // Enhanced popup and overlay selectors
  '[class*="popup"],[id*="popup"],[class*="modal"],[id*="modal"]',
  '[class*="overlay"],[id*="overlay"],[class*="lightbox"],[id*="lightbox"]',
  '[class*="dialog"],[id*="dialog"],[role="dialog"],[aria-modal="true"]',
  '[class*="notification"],[id*="notification"]',
  '[class*="alert"],[id*="alert"]',
  
  // Dynamic injection patterns
  '[style*="position: fixed"]',
  '[style*="z-index: 9999"]',
  '[style*="background-color: rgba"]',
  
  // Common promotional elements
  '[class*="promo"],[id*="promo"]',
  '[class*="banner"],[id*="banner"]',
  '[class*="newsletter"],[id*="newsletter"]',
  '[class*="subscribe"],[id*="subscribe"]',
  '[class*="offer"],[id*="offer"]',
  '[class*="deal"],[id*="deal"]',
  
  // Third-party promotional content
  'iframe[src*="facebook.com"]',
  'iframe[src*="twitter.com"]',
  'iframe[src*="analytics"]',
  'iframe[src*="tracker"]'
];

// Enhanced visibility check for popups
const isVisible = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);
  const isOverlay = computedStyle.position === 'fixed' || parseInt(computedStyle.zIndex, 10) > 999;
  
  return (rect.width > 0 && 
         rect.height > 0 && 
         computedStyle.display !== 'none' && 
         computedStyle.visibility !== 'hidden' &&
         computedStyle.opacity !== '0') ||
         isOverlay; // Consider overlays as visible even if not fully rendered
};

// Add popup style detection function
const isPopupStyle = (element: HTMLElement) => {
  const computedStyle = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  
  // Check for popup-like styles with proper null checks
  const hasPopupStyles = (
    computedStyle.position === 'fixed' ||
    computedStyle.position === 'absolute' ||
    parseInt(computedStyle.zIndex, 10) > 999 ||
    (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('rgba')) ||
    (computedStyle.backdropFilter && computedStyle.backdropFilter.includes('blur')) ||
    (computedStyle.boxShadow && computedStyle.boxShadow.includes('rgba'))
  );

  // Check for modal-like dimensions
  const isModalSize = (
    rect.width > window.innerWidth * 0.3 &&
    rect.height > window.innerHeight * 0.3
  );

  // Check for overlay characteristics
  const hasOverlayTraits = (
    element.classList.toString().toLowerCase().match(/modal|overlay|popup|lightbox|dialog/) ||
    element.id.toLowerCase().match(/modal|overlay|popup|lightbox|dialog/) ||
    element.getAttribute('role') === 'dialog' ||
    element.getAttribute('aria-modal') === 'true'
  );

  // Check for promotional styling
  const hasPromotionalStyling = (
    computedStyle.animation !== 'none' ||
    computedStyle.transform !== 'none' ||
    computedStyle.transition !== 'none' ||
    parseFloat(computedStyle.opacity) < 1
  );

  return hasPopupStyles || (isModalSize && hasOverlayTraits) || hasPromotionalStyling;
};

// Additional validation to ensure element is likely an ad
const isLikelyAd = (element: HTMLElement) => {
  // Skip essential page elements
  if (
    element.tagName === 'BODY' ||
    element.tagName === 'MAIN' ||
    element.tagName === 'ARTICLE' ||
    element.tagName === 'NAV' ||
    element.tagName === 'HEADER' ||
    element.tagName === 'FOOTER' ||
    element.id === 'content' ||
    element.id === 'main' ||
    element.classList.contains('content') ||
    element.classList.contains('main')
  ) {
    return false;
  }

  // Check for common ad dimensions
  const rect = element.getBoundingClientRect();
  const isCommonAdSize = (
    (rect.width === 300 && rect.height === 250) || // Medium Rectangle
    (rect.width === 728 && rect.height === 90) ||  // Leaderboard
    (rect.width === 160 && rect.height === 600) || // Wide Skyscraper
    (rect.width === 320 && rect.height === 50) ||  // Mobile Banner
    (rect.width === 970 && rect.height === 250) || // Large Rectangle
    (rect.width === 336 && rect.height === 280) || // Large Rectangle
    (rect.width === 300 && rect.height === 600) || // Half Page Ad
    (rect.width === 320 && rect.height === 100) || // Large Mobile Banner
    (rect.width === 468 && rect.height === 60)  || // Banner
    (rect.width === 234 && rect.height === 60)  || // Half Banner
    (rect.width === 120 && rect.height === 240) || // Vertical Banner
    (rect.width === 120 && rect.height === 90)     // Button
  );

  // Check for ad-related attributes
  const hasAdAttributes = [
    'data-ad',
    'data-ad-client',
    'data-ad-slot',
    'data-advertisement',
    'data-advertising',
    'data-ad-unit',
    'data-ad-zone',
    'data-sponsor',
    'data-placement',
    'data-outstream',
    'data-doubleclick',
    'data-adsense',
    'data-dfp',
    'data-gpt'
  ].some(attr => element.hasAttribute(attr));

  // Check for promotional content markers with enhanced null safety
  const elementText = element.textContent || '';
  const hasPromotionalContent = [
    'subscribe',
    'sign up',
    'join now',
    'limited time',
    'special offer',
    'discount',
    'promotion',
    'deal',
    'exclusive',
    'sponsored',
    'advertisement',
    'recommended',
    'promoted',
    'partner',
    'featured',
    'buy now',
    'shop now',
    'get started',
    'try for free',
    'learn more',
    'download now',
    'click here',
    'best offer',
    'sale ends',
    'limited stock',
    'premium',
    'upgrade',
    'trial',
    'membership',
    'subscribe now'
  ].some(term => elementText.toLowerCase().includes(term));

  // Check for common ad network classes and IDs with null checks
  const className = element.className?.toLowerCase() || '';
  const elementId = element.id?.toLowerCase() || '';
  const hasAdNetworkIdentifiers = (
    className.match(/adsbygoogle|ad-slot|ad-unit|dfp|prebid|taboola|outbrain|mgid|criteo|pubmatic|rubicon|openx|adform|smartadserver/i) ||
    elementId.match(/adsbygoogle|ad-slot|ad-unit|dfp|prebid|taboola|outbrain|mgid|criteo|pubmatic|rubicon|openx|adform|smartadserver/i)
  );

  // Check for iframe sources from ad networks
  const isAdIframe = element instanceof HTMLIFrameElement && element.src && [
    'doubleclick',
    'googlesyndication',
    'adnxs',
    'facebook',
    'twitter',
    'linkedin',
    'taboola',
    'outbrain',
    'mgid',
    'criteo',
    'pubmatic',
    'rubiconproject',
    'openx',
    'adform',
    'smartadserver'
  ].some(network => element.src.includes(network));

  return isCommonAdSize || 
         hasAdAttributes || 
         hasPromotionalContent || 
         hasAdNetworkIdentifiers || 
         isAdIframe || 
         isPopupStyle(element);
};

// Enhanced content replacement
const replaceAdContent = (adElement: HTMLElement) => {
  try {
    // Skip if the element is the main content area or essential page elements
    if (
      adElement.tagName === 'BODY' ||
      adElement.tagName === 'MAIN' ||
      adElement.tagName === 'ARTICLE' ||
      adElement.id === 'content' ||
      adElement.id === 'main' ||
      adElement.classList.contains('content') ||
      adElement.classList.contains('main')
    ) {
      console.debug('[AdFriend] Skipping essential page element:', adElement);
      return;
    }

    // Store original dimensions
    const originalStyles = {
      width: adElement.style.width,
      height: adElement.style.height,
      display: adElement.style.display,
      position: adElement.style.position
    };

    // Clean up existing content and any existing React root
    const existingRoot = adElement.querySelector('[data-react-root]');
    if (existingRoot) {
      const root = createRoot(existingRoot);
      root.unmount();
      existingRoot.remove();
    }

    // Preserve the element's position in the document flow
    const wasFixed = window.getComputedStyle(adElement).position === 'fixed';
    
    // Clear content while maintaining structure
    adElement.style.display = originalStyles.display || 'block';
    adElement.style.position = wasFixed ? 'fixed' : (originalStyles.position || 'relative');
    adElement.style.minWidth = '200px';
    adElement.style.minHeight = '100px';
    adElement.style.overflow = 'hidden';
    
    while (adElement.firstChild) {
      adElement.removeChild(adElement.firstChild);
    }

    const root = document.createElement('div');
    root.setAttribute('data-react-root', 'true');
    root.style.width = '100%';
    root.style.height = '100%';
    root.style.display = 'flex';
    root.style.alignItems = 'center';
    root.style.justifyContent = 'center';
    root.style.backgroundColor = '#ffffff';
    root.style.padding = '1rem';
    root.style.borderRadius = '8px';
    root.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    
    adElement.appendChild(root);
    
    const reactRoot = createRoot(root);
    reactRoot.render(
      <React.StrictMode>
        <React.Suspense fallback={<div>Loading...</div>}>
          <ContentWidget type={contentTypes[Math.floor(Math.random() * contentTypes.length)]} />
        </React.Suspense>
      </React.StrictMode>
    );

    console.debug('[AdFriend] Successfully transformed ad space:', adElement);
    // Notify background script about successful transformation
    chrome.runtime.sendMessage({ type: 'AD_TRANSFORMED' });
  } catch (error) {
    console.error('[AdFriend] Error replacing ad content:', error);
    // Restore original state in case of error
    adElement.innerHTML = `
      <div style="padding: 1rem; text-align: center; color: #666;">
        <p>✨ Ad space transformed into something positive ✨</p>
      </div>
    `;
  }
};

// Use requestIdleCallback for better performance
const processNode = (node: HTMLElement) => {
  if (!('requestIdleCallback' in window)) {
    return setTimeout(() => checkNode(node), 0);
  }
  requestIdleCallback(() => checkNode(node));
};

const checkNode = (node: HTMLElement) => {
  // Skip if node is already being processed or is a React root
  if (node.dataset.processing || node.hasAttribute('data-react-root')) {
    return;
  }

  // Set processing flag
  node.dataset.processing = 'true';

  const adElements = node.querySelectorAll(adSelectors.join(','));
  adElements.forEach((adElement) => {
    if (adElement instanceof HTMLElement && 
        !adElement.dataset.processed && 
        !adElement.closest('[data-react-root]') && 
        isVisible(adElement) &&
        isLikelyAd(adElement)) {
      adElement.dataset.processed = 'true';
      // Force layout recalculation to ensure proper dimensions
      void adElement.offsetHeight;
      replaceAdContent(adElement);
      
      // Log successful replacement
      console.debug('[AdFriend] Successfully replaced ad content:', adElement);
    }
  });

  // Clear processing flag
  delete node.dataset.processing;
};

// Initial check for existing ad elements
document.addEventListener('DOMContentLoaded', () => {
  checkNode(document.body);
});

// Additional check after all resources are loaded
window.addEventListener('load', () => {
  checkNode(document.body);
});



interface ExtendedMutationObserver extends MutationObserver {
  timeout?: number;
}

// Create MutationObserver with type casting
// Enhanced error handling for blocked resources
const handleBlockedResource = (event: ErrorEvent) => {
  if (event.message.includes('ERR_BLOCKED_BY_CLIENT')) {
    console.debug('[AdFriend] Successfully blocked resource:', event.filename);
    return;
  }
  // Let other errors propagate
  return false;
};

// Add global error handler
window.addEventListener('error', handleBlockedResource, true);

// Enhanced MutationObserver with better error handling
const adObserver = new MutationObserver((mutations) => {
  // Debounce multiple rapid mutations
  if ((adObserver as ExtendedMutationObserver).timeout) {
    window.clearTimeout((adObserver as ExtendedMutationObserver).timeout);
  }

  (adObserver as ExtendedMutationObserver).timeout = window.setTimeout(() => {
    mutations.forEach((mutation) => {
      try {
        // Skip mutations caused by our own content replacement
        if ((mutation.target as Element).closest('[data-react-root]')) {
          return;
        }

        // Handle added nodes with priority for popups
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement && !node.closest('[data-react-root]')) {
            // Check for immediate popup characteristics
            if (node.style && isLikelyAd(node)) {
              processNode(node);
              return;
            }
            // Process other potential ad elements
            processNode(node);
          }
        });

        // Enhanced attribute monitoring
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'style' || 
             mutation.attributeName === 'class')) {
          const element = mutation.target as HTMLElement;
          if (element && 
              !element.dataset.processed && 
              !element.closest('[data-react-root]')) {
            // Prioritize popup detection
            if (element.style && isLikelyAd(element)) {
              processNode(element);
              return;
            }
            processNode(element);
          }
        }
      } catch (error) {
        console.debug('[AdFriend] Skipping mutation due to error:', error);
      }
    });
  }, 50); // Reduced debounce time for faster response
}) as ExtendedMutationObserver;

// Start observing the document with the configured parameters
adObserver.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['src', 'style', 'class']
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message: Message) => {
  if (message.type === 'REPLACE_AD' && message.payload) {
    const { url } = message.payload;
    
    try {
      const adContainer = document.querySelector(`[src="${url}"]`)?.parentElement;
      if (adContainer instanceof HTMLElement) {
        replaceAdContent(adContainer);
      }
    } catch (error) {
      console.error('[AdFriend] Error processing message:', error);
    }
  }
});