import type { ReplacedElement } from "../types";

// Simple Message type definition
interface Message {
  type: "CONTENT_SCRIPT_READY" | "DISABLE_ADFRIEND" | "ENABLE_ADFRIEND";
}

// Keep track of replaced elements to restore them
let replacedElements: ReplacedElement[] = [];

// Content collections
const inspirationalQuotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "Stay hungry, stay foolish. - Steve Jobs",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Success is not final, failure is not fatal. - Winston Churchill",
  "Be the change you wish to see in the world. - Mahatma Gandhi",
  "Everything you've ever wanted is on the other side of fear. - George Addair",
  "The best way to predict the future is to create it. - Peter Drucker",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
  "Life is 10% what happens to you and 90% how you react to it. - Charles R. Swindoll",
  "The journey of a thousand miles begins with one step. - Lao Tzu",
  "What you do today can improve all your tomorrows. - Ralph Marston",
  "The secret of getting ahead is getting started. - Mark Twain",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "Quality is not an act, it is a habit. - Aristotle",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream big and dare to fail. - Norman Vaughan",
  "Wake up determined, go to bed satisfied.",
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
];

const scienceFacts = [
  "A teaspoonful of neutron star would weigh 6 billion tons.",
  "Honeybees can recognize human faces.",
  "Light travels at 299,792,458 meters per second.",
  "A day on Venus is longer than its year.",
  "DNA is about 98% identical in humans and chimpanzees.",
  "The human brain processes images in just 13 milliseconds.",
  "Quantum entanglement allows particles to instantly share their quantum states.",
  "There are more possible iterations of a game of chess than atoms in the universe.",
  "The Milky Way galaxy is moving through space at 2.1 million kilometers per hour.",
  "The average human body contains enough carbon to make 900 pencils.",
  "A single lightning bolt contains enough energy to toast 100,000 slices of bread.",
  "The human body generates enough heat in 30 minutes to boil a gallon of water.",
  "Bananas are berries, but strawberries aren't.",
  "The Great Wall of China is not visible from space with the naked eye.",
  "A hummingbird's heart beats up to 1,260 times per minute.",
  "Octopuses have three hearts and blue blood.",
  "The universe is expanding faster than the speed of light.",
  "Time passes faster at your head than at your feet.",
  "A single cloud can weigh more than a million pounds.",
  "There are more trees on Earth than stars in the Milky Way.",
];

const healthReminders = [
  "Time for a posture check! Sit up straight 🪑",
  "Remember to stay hydrated! Drink some water 💧",
  "Take a break! Look away from the screen for 20 seconds 👀",
  "Stand up and stretch for a minute 🧘‍♂️",
  "Deep breathing exercise: Take 3 deep breaths 🫁",
  "Relax your shoulders and unclench your jaw 😌",
  "Time for a quick walk around! Get moving 🚶‍♂️",
  "Blink your eyes several times to prevent eye strain 👁️",
  "Roll your shoulders and neck gently 🔄",
  "Check your screen brightness and distance 🖥️",
  "Time to refill your water bottle! Stay hydrated 🚰",
  "Do some ankle and wrist rotations 🔄",
  "Practice the 20-20-20 rule: Look 20ft away for 20s every 20min 👀",
  "Time for a mindful minute of meditation 🧘",
  "Stretch your arms and fingers 🤸‍♂️",
  "Check your sitting position and adjust if needed 💺",
  "Remember to take your vitamins! 💊",
  "Time for a healthy snack! Grab some fruits 🍎",
  "Stand up and do some light exercises 🏃‍♂️",
  "Take a moment to practice gratitude 🙏",
];

// Animation keyframes
const animations = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Add animations to document
const style = document.createElement("style");
style.textContent = animations;
document.head.appendChild(style);

// Content types
type ContentType = "quote" | "fact" | "reminder";

// Function to get random content
function getRandomContent(type: ContentType): string {
  switch (type) {
    case "quote":
      return inspirationalQuotes[
        Math.floor(Math.random() * inspirationalQuotes.length)
      ];
    case "fact":
      return scienceFacts[Math.floor(Math.random() * scienceFacts.length)];
    case "reminder":
      return healthReminders[
        Math.floor(Math.random() * healthReminders.length)
      ];
    default:
      return inspirationalQuotes[0];
  }
}

// Function to create inspirational content
function createInspirationalContent(): HTMLElement {
  const container = document.createElement("div");
  container.className = "adfriend-inspiration";

  // Randomly select content type
  const contentTypes: ContentType[] = ["quote", "fact", "reminder"];
  const randomType =
    contentTypes[Math.floor(Math.random() * contentTypes.length)];

  // Style based on content type
  const gradients = {
    quote: "linear-gradient(135deg, #4f46e5, #818cf8)",
    fact: "linear-gradient(135deg, #059669, #34d399)",
    reminder: "linear-gradient(135deg, #db2777, #f472b6)",
  };

  const shimmerGradient = {
    quote:
      "linear-gradient(90deg, #4f46e5 0%, #818cf8 25%, #4f46e5 50%, #818cf8 75%, #4f46e5 100%)",
    fact: "linear-gradient(90deg, #059669 0%, #34d399 25%, #059669 50%, #34d399 75%, #059669 100%)",
    reminder:
      "linear-gradient(90deg, #db2777 0%, #f472b6 25%, #db2777 50%, #f472b6 75%, #db2777 100%)",
  };

  container.style.cssText = `
    padding: 20px;
    background: ${gradients[randomType]};
    background-size: 200% auto;
    color: white;
    border-radius: 12px;
    text-align: center;
    font-family: system-ui, -apple-system, sans-serif;
    box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
    margin: 15px 0;
    transition: all 0.3s ease;
    cursor: pointer;
    animation: fadeIn 0.5s ease-out, float 3s ease-in-out infinite;
    position: relative;
    overflow: hidden;
  `;

  const content = document.createElement("p");
  content.textContent = getRandomContent(randomType);
  content.style.cssText = `
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    font-weight: 500;
    position: relative;
    z-index: 1;
  `;

  // Add shimmer effect
  const shimmer = document.createElement("div");
  shimmer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${shimmerGradient[randomType]};
    background-size: 200% auto;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  // Interactive effects
  container.addEventListener("mouseenter", () => {
    container.style.transform = "scale(1.02) translateY(-5px)";
    container.style.boxShadow = "0 12px 24px -8px rgba(0, 0, 0, 0.2)";
    shimmer.style.opacity = "0.1";
    shimmer.style.animation = "shimmer 2s linear infinite";
  });

  container.addEventListener("mouseleave", () => {
    container.style.transform = "scale(1) translateY(0)";
    container.style.boxShadow = "0 8px 16px -4px rgba(0, 0, 0, 0.1)";
    shimmer.style.opacity = "0";
    shimmer.style.animation = "none";
  });

  // Click effect with random animation
  container.addEventListener("click", () => {
    const animations = ["pulse", "rotate"];
    const randomAnimation =
      animations[Math.floor(Math.random() * animations.length)];
    content.textContent = getRandomContent(randomType);
    container.style.animation = `${randomAnimation} 0.5s ease-in-out`;

    // Reset animation
    setTimeout(() => {
      container.style.animation = "float 3s ease-in-out infinite";
    }, 500);
  });

  container.appendChild(shimmer);
  container.appendChild(content);
  return container;
}

// Function to replace ad with inspirational content
function replaceAdWithInspiration(adElement: Element): void {
  const inspiration = createInspirationalContent();

  // Store original element and its replacement
  replacedElements.push({
    original: adElement.cloneNode(true) as Element,
    replacement: inspiration,
  });

  // Replace the ad
  adElement.replaceWith(inspiration);
}

// Function to restore original ads
function restoreOriginalAds(): void {
  replacedElements.forEach(({ original, replacement }) => {
    try {
      if (replacement.parentNode) {
        replacement.replaceWith(original);
      }
    } catch (error) {
      console.log("[AdFriend] Error restoring element:", error);
    }
  });
  // Clear the stored elements
  replacedElements = [];
}

// Set up MutationObserver for dynamic ad detection
const adSelectors = [
  // Basic ad patterns
  '[id^="ad-"],[id^="ads-"],[class^="ad-"],[class^="ads-"]',
  '[id*="advertisement"],[class*="advertisement"]',
  '[id*="banner-ad"],[class*="banner-ad"]',
  '[id*="sponsored-"],[class*="sponsored-"]',
  // Enhanced popup and overlay selectors
  '[class*="popup"],[id*="popup"],[class*="modal"],[id*="modal"]',
  '[class*="overlay"],[id*="overlay"],[class*="lightbox"],[id*="lightbox"]',
  '[class*="dialog"],[id*="dialog"],[role="dialog"],[aria-modal="true"]',
  // Common promotional elements
  '[class*="promo"],[id*="promo"]',
  '[class*="banner"],[id*="banner"]',
  '[class*="newsletter"],[id*="newsletter"]',
];

// Observer callback
const observerCallback = (mutations: MutationRecord[]): void => {
  chrome.storage.sync.get(["enabled"], (result) => {
    if (!result.enabled) return;

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          const element = node as Element;
          adSelectors.forEach((selector) => {
            if (element.matches?.(selector)) {
              replaceAdWithInspiration(element);
            }
            element.querySelectorAll(selector).forEach((adElement) => {
              replaceAdWithInspiration(adElement);
            });
          });
        }
      });
    });
  });
};

// Create and start observer
const observer = new MutationObserver(observerCallback);

// Start observing if extension is enabled
chrome.storage.sync.get(["enabled"], (result) => {
  if (result.enabled) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Handle existing ads
    adSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((adElement) => {
        replaceAdWithInspiration(adElement);
      });
    });
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message: Message) => {
  if (message.type === "DISABLE_ADFRIEND") {
    observer.disconnect();
    restoreOriginalAds();
  } else if (message.type === "ENABLE_ADFRIEND") {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    adSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((adElement) => {
        replaceAdWithInspiration(adElement);
      });
    });
  }
});
