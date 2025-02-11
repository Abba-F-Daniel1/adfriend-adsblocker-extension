document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleButton');
  const blockedCountElement = document.getElementById('blockedCount');
  const transformedCountElement = document.getElementById('transformedCount');

  // Function to update count display with animation
  function updateCountDisplay(blockedCount, transformedCount) {
    blockedCountElement.textContent = blockedCount;
    transformedCountElement.textContent = transformedCount;

    // Add pulse animation
    blockedCountElement.style.animation = 'none';
    transformedCountElement.style.animation = 'none';
    blockedCountElement.offsetHeight; // Trigger reflow
    transformedCountElement.offsetHeight; // Trigger reflow
    blockedCountElement.style.animation = 'pulse 0.3s ease-in-out';
    transformedCountElement.style.animation = 'pulse 0.3s ease-in-out';
  }

  // Load initial state and counts
  chrome.storage.sync.get(['enabled', 'blockedCount', 'transformedCount'], (result) => {
    const isEnabled = result.enabled ?? true;
    updateButtonState(isEnabled);
    updateCountDisplay(result.blockedCount || 0, result.transformedCount || 0);
  });

  // Toggle handler
  toggleButton.addEventListener('click', () => {
    const isCurrentlyEnabled = toggleButton.classList.contains('enabled');
    const newState = !isCurrentlyEnabled;
    
    updateButtonState(newState);
    chrome.storage.sync.set({ enabled: newState });
  });

  function updateButtonState(isEnabled) {
    toggleButton.textContent = isEnabled ? 'Enabled' : 'Disabled';
    toggleButton.classList.toggle('enabled', isEnabled);
    toggleButton.classList.toggle('disabled', !isEnabled);
  }

  // Listen for count updates from background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'updateCounts') {
      updateCountDisplay(message.blockedCount, message.transformedCount);
    }
  });
});