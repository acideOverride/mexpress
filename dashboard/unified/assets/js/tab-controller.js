/**
 * Super simple tab controller script
 */

// Make sure the window is loaded
window.onload = function() {
  console.log("Tab controller loaded");
  
  // Get all the tab elements
  var tabs = document.querySelectorAll('.sub-tab');
  
  // Add click event handlers
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', handleTabClick);
  }
  
  function handleTabClick() {
    var tabId = this.getAttribute('data-subtab');
    console.log("Tab clicked: " + tabId);
    showTab(tabId);
    return false;
  }
  
  function showTab(tabId) {
    // 1. Remove active from all tabs
    var allTabs = document.querySelectorAll('.sub-tab');
    for (var i = 0; i < allTabs.length; i++) {
      allTabs[i].classList.remove('active');
    }
    
    // 2. Add active to clicked tab
    var selectedTab = document.querySelector('.sub-tab[data-subtab="' + tabId + '"]');
    if (selectedTab) {
      selectedTab.classList.add('active');
    }
    
    // 3. Remove active from all content
    var allContents = document.querySelectorAll('.sub-tab-content');
    for (var i = 0; i < allContents.length; i++) {
      allContents[i].classList.remove('active');
      allContents[i].style.display = 'none';
    }
    
    // 4. Show selected content
    var selectedContent = document.getElementById(tabId + '-tab');
    if (selectedContent) {
      selectedContent.classList.add('active');
      selectedContent.style.display = 'block';
      
      // Handle special case for connections tab
      if (tabId === 'connections') {
        if (window.initializeConnectionsDiagram) {
          setTimeout(window.initializeConnectionsDiagram, 100);
        }
      }
    }
  }
  
  // Expose globally
  window.showTab = showTab;
};