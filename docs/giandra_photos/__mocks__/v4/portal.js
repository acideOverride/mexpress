// This is a simplified version focusing ONLY on making the loader work
console.log("Portal.js loaded");

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded - setting up basic functionality");
  
  // Basic cursor functionality
  const cursor = document.querySelector('.custom-cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
  }
  
  // Filter functionality 
  const filterTags = document.querySelectorAll('.filter-tag');
  const collectionCards = document.querySelectorAll('.collection-card');
  
  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const filter = tag.getAttribute('data-filter');
      
      filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      
      collectionCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'block';
        } else {
          const categories = card.getAttribute('data-categories').split(' ');
          if (categories.includes(filter)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });
  
  // Collection card click
  const collectionDetailPanel = document.querySelector('.detail-panel');
  const collectionCards = document.querySelectorAll('.collection-card');
  const closePanel = document.querySelector('.close-panel');
  
  if (collectionDetailPanel && closePanel) {
    collectionCards.forEach(card => {
      card.addEventListener('click', () => {
        collectionDetailPanel.classList.add('active');
      });
    });
    
    closePanel.addEventListener('click', () => {
      collectionDetailPanel.classList.remove('active');
    });
  }
});

// The code below should run regardless of DOM loading state
console.log("Running loader independently of DOM");

// Try to immediately handle the loader
function runLoader() {
  console.log("Attempting to run loader");
  const loadingScreen = document.querySelector('.loading-screen');
  const loadingPercentage = document.querySelector('.loading-percentage');
  
  if (!loadingScreen || !loadingPercentage) {
    console.error("Loader elements not found, trying again in 50ms");
    setTimeout(runLoader, 50);
    return;
  }
  
  console.log("Loader elements found, starting counter");
  
  // Ensure loader is visible
  loadingScreen.style.visibility = 'visible';
  loadingScreen.style.opacity = '1'; 
  loadingScreen.style.display = 'flex';
  
  // Start the counter
  let count = 0;
  const interval = setInterval(() => {
    count += 5;
    
    if (count > 100) {
      count = 100;
      clearInterval(interval);
      
      console.log("Loader at 100%, hiding...");
      loadingPercentage.textContent = '100%';
      
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.visibility = 'hidden';
          loadingScreen.style.display = 'none';
          console.log("Loader hidden completely");
        }, 500);
      }, 500);
    } else {
      loadingPercentage.textContent = `${count}%`;
      console.log("Loader at", count, "%");
    }
  }, 100);
}

// Run loader as soon as possible
runLoader();

// Backup: force-remove loader after 5 seconds if it's still visible
setTimeout(() => {
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    console.log("BACKUP: Force-removing loader after timeout");
    loadingScreen.style.visibility = 'hidden';
    loadingScreen.style.display = 'none';
  }
}, 5000);