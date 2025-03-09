/* Last resort tab fix - preserves all styling */

// After multiple approaches, this is the last attempt to fix tabs
window.onload = function() {
  console.log('=== LAST ATTEMPT TAB FIX LOADED ===');
  
  // Wait to let everything settle, then override all handlers
  setTimeout(function() {
    // Architecture tabs handling
    setupArchitectureTabs();
    
    // Test status tabs handling
    setupTestStatusTabs();
  }, 1000); // Delay to ensure everything is fully loaded
};

// Setup architecture tabs functionality
function setupArchitectureTabs() {
  // Directly define a global function to show tabs
  window.activateArchitectureTab = function(tabId) {
    console.log('Direct tab activation: ' + tabId);
    
    // Hide all content
    document.getElementById('overview-tab')?.style.setProperty('display', 'none');
    document.getElementById('components-tab')?.style.setProperty('display', 'none');
    document.getElementById('brqs-tab')?.style.setProperty('display', 'none');
    document.getElementById('connections-tab')?.style.setProperty('display', 'none');
    document.getElementById('roadmap-tab')?.style.setProperty('display', 'none');
    
    // Remove active from all tabs
    var tabs = document.querySelectorAll('.sub-tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('active');
      tabs[i].style.borderBottom = '3px solid transparent';
      tabs[i].style.color = 'var(--blueprint-text)';
    }
    
    // Activate selected tab
    var selectedTab = document.getElementById('tab-' + tabId);
    if (selectedTab) {
      selectedTab.classList.add('active');
      selectedTab.style.borderBottom = '3px solid var(--blueprint-accent)';
      selectedTab.style.color = 'var(--blueprint-accent)';
    }
    
    // Show selected content
    var selectedContent = document.getElementById(tabId + '-tab');
    if (selectedContent) {
      selectedContent.style.display = 'block';
      
      // Special handling for connections tab
      if (tabId === 'connections' && typeof window.initializeConnectionsDiagram === 'function') {
        console.log('Initializing connections from global handler');
        setTimeout(function() {
          window.initializeConnectionsDiagram();
        }, 100);
      }
    }
    
    return false; // Prevent default
  };
  
  // Directly modify each tab element to add the onclick
  console.log('Setting up direct onclick handlers for architecture tabs');
  
  // For overview tab
  var overviewTab = document.getElementById('tab-overview');
  if (overviewTab) {
    overviewTab.setAttribute('onclick', 'return window.activateArchitectureTab("overview")');
  }
  
  // For components tab
  var componentsTab = document.getElementById('tab-components');
  if (componentsTab) {
    componentsTab.setAttribute('onclick', 'return window.activateArchitectureTab("components")');
  }
  
  // For BRQs tab
  var brqsTab = document.getElementById('tab-brqs');
  if (brqsTab) {
    brqsTab.setAttribute('onclick', 'return window.activateArchitectureTab("brqs")');
  }
  
  // For connections tab
  var connectionsTab = document.getElementById('tab-connections');
  if (connectionsTab) {
    connectionsTab.setAttribute('onclick', 'return window.activateArchitectureTab("connections")');
  }
  
  // For roadmap tab
  var roadmapTab = document.getElementById('tab-roadmap');
  if (roadmapTab) {
    roadmapTab.setAttribute('onclick', 'return window.activateArchitectureTab("roadmap")');
  }
}

// Setup test status tabs functionality
function setupTestStatusTabs() {
  // Create global function for test status tabs
  window.activateTestStatusTab = function(tabId) {
    console.log('Test status tab activation: ' + tabId);
    
    // Hide all content
    document.getElementById('overview-tab')?.style.setProperty('display', 'none');
    document.getElementById('p0-tab')?.style.setProperty('display', 'none');
    document.getElementById('p1-tab')?.style.setProperty('display', 'none');
    document.getElementById('p2-tab')?.style.setProperty('display', 'none');
    document.getElementById('p3-tab')?.style.setProperty('display', 'none');
    document.getElementById('stats-tab')?.style.setProperty('display', 'none');
    
    // Remove active from all tabs (reset styling)
    var tabs = document.querySelectorAll('.sub-tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('active');
      tabs[i].style.background = '#1a3c64';
      tabs[i].style.color = '#fff';
      tabs[i].style.border = 'none';
      tabs[i].style.borderRadius = '0';
    }
    
    // Activate selected tab with smooth transition
    var selectedTab = document.getElementById('tab-' + tabId);
    if (selectedTab) {
      selectedTab.classList.add('active');
      selectedTab.style.background = '#fff';
      selectedTab.style.color = '#333';
      selectedTab.style.borderTopLeftRadius = '0';
      selectedTab.style.borderTopRightRadius = '0';
      selectedTab.style.boxShadow = '0 -3px 10px rgba(0,0,0,0.1)';
      
      // Apply subtle scale effect for better visual feedback
      selectedTab.style.transform = 'translateY(-1px)';
      setTimeout(function() {
        selectedTab.style.transform = 'translateY(0)';
      }, 150);
    }
    
    // Show selected content with proper styling
    var selectedContent = document.getElementById(tabId + '-tab');
    if (selectedContent) {
      selectedContent.style.display = 'block';
      selectedContent.style.animation = 'fadeIn 0.3s ease';
    }
    
    return false; // Prevent default
  };
  
  // Set up click handlers for test status tabs
  console.log('Setting up direct onclick handlers for test status tabs');
  
  // For overview tab
  var overviewTab = document.getElementById('tab-overview');
  if (overviewTab) {
    overviewTab.setAttribute('onclick', 'return window.activateTestStatusTab("overview")');
  }
  
  // For P0 tab
  var p0Tab = document.getElementById('tab-p0');
  if (p0Tab) {
    p0Tab.setAttribute('onclick', 'return window.activateTestStatusTab("p0")');
  }
  
  // For P1 tab
  var p1Tab = document.getElementById('tab-p1');
  if (p1Tab) {
    p1Tab.setAttribute('onclick', 'return window.activateTestStatusTab("p1")');
  }
  
  // For P2 tab
  var p2Tab = document.getElementById('tab-p2');
  if (p2Tab) {
    p2Tab.setAttribute('onclick', 'return window.activateTestStatusTab("p2")');
  }
  
  // For P3 tab
  var p3Tab = document.getElementById('tab-p3');
  if (p3Tab) {
    p3Tab.setAttribute('onclick', 'return window.activateTestStatusTab("p3")');
  }
  
  // For Stats tab
  var statsTab = document.getElementById('tab-stats');
  if (statsTab) {
    statsTab.setAttribute('onclick', 'return window.activateTestStatusTab("stats")');
  }
}