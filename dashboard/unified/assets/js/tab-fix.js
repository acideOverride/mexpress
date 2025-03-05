/* Ultra-basic tab fix */

// Hard-code the tab fix since nothing else works
document.addEventListener('DOMContentLoaded', function() {
  // Set up completely hard-coded click handlers
  
  // Overview tab
  document.querySelector('[data-subtab="overview"]').onclick = function() {
    showSpecificTab('overview');
    return false;
  };
  
  // Components tab
  document.querySelector('[data-subtab="components"]').onclick = function() {
    showSpecificTab('components');
    return false;
  };
  
  // BRQs tab
  document.querySelector('[data-subtab="brqs"]').onclick = function() {
    showSpecificTab('brqs');
    return false;
  };
  
  // Connections tab
  document.querySelector('[data-subtab="connections"]').onclick = function() {
    showSpecificTab('connections');
    return false;
  };
  
  // Roadmap tab
  document.querySelector('[data-subtab="roadmap"]').onclick = function() {
    showSpecificTab('roadmap');
    return false;
  };
  
  // The function to actually show a tab
  function showSpecificTab(tabId) {
    // Hide all tab content
    var allContent = document.querySelectorAll('.sub-tab-content');
    for (var i = 0; i < allContent.length; i++) {
      allContent[i].style.display = 'none';
      allContent[i].classList.remove('active');
    }
    
    // Remove active class from all tabs
    var allTabs = document.querySelectorAll('.sub-tab');
    for (var i = 0; i < allTabs.length; i++) {
      allTabs[i].classList.remove('active');
    }
    
    // Add active class to selected tab
    var selectedTab = document.querySelector('[data-subtab="' + tabId + '"]');
    if (selectedTab) {
      selectedTab.classList.add('active');
    }
    
    // Show selected content
    var contentId = tabId + '-tab';
    var content = document.getElementById(contentId);
    if (content) {
      content.style.display = 'block';
      content.classList.add('active');
      
      // Initialize connections diagram if needed
      if (tabId === 'connections' && typeof window.initializeConnectionsDiagram === 'function') {
        setTimeout(window.initializeConnectionsDiagram, 100);
      }
    }
  }
});