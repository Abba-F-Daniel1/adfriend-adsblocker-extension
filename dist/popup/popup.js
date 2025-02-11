document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleButton');
  const blockedCountElement = document.getElementById('blockedCount');
  const dataSavedElement = document.getElementById('dataSaved');
  const energySavedElement = document.getElementById('energySaved');
  const darkModeToggle = document.getElementById('darkModeToggle');
  let blockingChart;

  // Function to update count display with animation
  function updateCountDisplay(blockedCount) {
    if (blockedCountElement) {
      blockedCountElement.textContent = blockedCount.toLocaleString();
      blockedCountElement.style.animation = 'none';
      blockedCountElement.offsetHeight; // Trigger reflow
      blockedCountElement.style.animation = 'pulse 0.3s ease-in-out';
    }
  }

  // Initialize Chart.js
  function initializeChart() {
    const ctx = document.getElementById('blockingGraph').getContext('2d');
    blockingChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({length: 7}, (_, i) => `Day ${i + 1}`),
        datasets: [{
          label: 'Ads Blocked',
          data: [0, 0, 0, 0, 0, 0, 0],
          borderColor: '#2563eb',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
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

  // Load initial state and counts
  chrome.storage.sync.get(['enabled', 'blockedCount', 'darkMode', 'blockingHistory'], (result) => {
    const isEnabled = result.enabled ?? true;
    const blockedCount = result.blockedCount || 0;
    const blockingHistory = result.blockingHistory || Array(7).fill(0);
    
    updateButtonState(isEnabled);
    updateCountDisplay(blockedCount);
    
    const isDark = result.darkMode ?? false;
    darkModeToggle.checked = isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    updateImpactMetrics(blockedCount);
    initializeChart();
    
    // Update chart with actual history data
    if (blockingChart) {
      blockingChart.data.datasets[0].data = blockingHistory;
      blockingChart.update();
    }
  });

  // Toggle handler
  toggleButton.addEventListener('click', () => {
    const isCurrentlyEnabled = toggleButton.classList.contains('enabled');
    const newState = !isCurrentlyEnabled;
    const currentCount = parseInt(blockedCountElement.textContent) || 0;
    
    updateButtonState(newState, currentCount);
    chrome.storage.sync.set({ enabled: newState });
  });

  function updateButtonState(isEnabled) {
    toggleButton.textContent = isEnabled ? 'Enabled' : 'Disabled';
    toggleButton.classList.toggle('enabled', isEnabled);
    toggleButton.classList.toggle('disabled', !isEnabled);
  }

  // Dark mode handler
  darkModeToggle.addEventListener('change', (e) => {
    const isDark = e.target.checked;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    chrome.storage.sync.set({ darkMode: isDark });
  });

  // Listen for updates from background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'updateCounts') {
      const newCount = message.blockedCount;
      updateCountDisplay(newCount);
      updateImpactMetrics(newCount);
      
      // Update chart with new data point
      if (blockingChart && message.blockingHistory) {
        blockingChart.data.datasets[0].data = message.blockingHistory;
        blockingChart.update();
      }
      
      // Update button state while preserving the count
      updateButtonState(toggleButton.classList.contains('enabled'));
    }
  });
});