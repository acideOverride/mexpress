// Fix for tab navigation in architecture-detailed.html
document.addEventListener('DOMContentLoaded', function() {
  console.log('Tab fix script loaded');
  
  // Override the setupSubTabs function to ensure it works properly
  window.setupSubTabs = function() {
    console.log('Setting up sub-tabs with fixed implementation');
    
    const subTabs = document.querySelectorAll('.sub-tab');
    const subTabContents = document.querySelectorAll('.sub-tab-content');
    
    console.log(`Found ${subTabs.length} tabs and ${subTabContents.length} content areas`);
    
    subTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        console.log(`Tab clicked: ${tab.getAttribute('data-subtab')}`);
        
        // Remove active class from all tabs and contents
        subTabs.forEach(t => t.classList.remove('active'));
        subTabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        const subtabId = tab.getAttribute('data-subtab');
        const contentEl = document.getElementById(`${subtabId}-tab`);
        
        if (contentEl) {
          contentEl.classList.add('active');
          
          // Initialize D3 connections diagram when connections tab is selected
          if (subtabId === 'connections' && typeof window.initializeConnectionsDiagram === 'function') {
            console.log('Initializing connections diagram');
            setTimeout(() => window.initializeConnectionsDiagram(), 100);
          }
        } else {
          console.error(`Content element for ${subtabId} not found`);
        }
      });
    });
  };
  
  // Direct application of the tab fix
  const subTabs = document.querySelectorAll('.sub-tab');
  const subTabContents = document.querySelectorAll('.sub-tab-content');
  
  if (subTabs.length > 0 && subTabContents.length > 0) {
    console.log(`Directly applying tab fix to ${subTabs.length} tabs`);
    
    subTabs.forEach(tab => {
      tab.addEventListener('click', function(e) {
        e.preventDefault();
        const subtabId = this.getAttribute('data-subtab');
        console.log(`Tab clicked: ${subtabId}`);
        
        // Remove active class from all tabs and contents
        subTabs.forEach(t => t.classList.remove('active'));
        subTabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        this.classList.add('active');
        const contentEl = document.getElementById(`${subtabId}-tab`);
        
        if (contentEl) {
          contentEl.classList.add('active');
          
          // Initialize connections diagram if needed
          if (subtabId === 'connections' && typeof window.initializeConnectionsDiagram === 'function') {
            console.log('Initializing connections diagram from direct handler');
            setTimeout(() => window.initializeConnectionsDiagram(), 100);
          }
        } else {
          console.error(`Content element for ${subtabId} not found`);
        }
      });
    });
  } else {
    console.error('Sub-tabs or content areas not found in the document');
  }
  
  console.log('Tab navigation fix applied');
});