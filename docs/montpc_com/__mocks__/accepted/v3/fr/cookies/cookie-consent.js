/**
 * MontPC Cookie Consent Module
 * Basic but legally compliant cookie consent functionality
 * For the French version of MontPC.com website
 */

document.addEventListener('DOMContentLoaded', () => {
  initializeCookieConsent();
});

/**
 * Initialize cookie consent banner and functionality
 */
function initializeCookieConsent() {
  const cookieBanner = document.getElementById('cookie-consent');
  const acceptButton = document.getElementById('cookie-accept');
  const rejectButton = document.getElementById('cookie-reject');
  const preferencesButton = document.getElementById('cookie-preferences');
  
  // Check if user has already made a choice
  const cookieConsent = localStorage.getItem('cookieConsent');
  
  if (cookieConsent === null) {
    // Show banner if no choice has been made - with animation
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 1000); // Delay to allow page to load first
  } else {
    // Apply saved preferences
    applyCookiePreferences(JSON.parse(cookieConsent));
  }
  
  // Accept button click handler
  acceptButton.addEventListener('click', () => {
    const preferences = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    
    // Save preferences
    saveCookiePreferences(preferences);
    
    // Hide banner with animation
    cookieBanner.classList.remove('show');
    setTimeout(() => {
      cookieBanner.style.display = 'none';
    }, 500);
  });
  
  // Reject button click handler
  rejectButton.addEventListener('click', () => {
    const preferences = {
      essential: true, // Essential cookies are always allowed
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    
    // Save preferences
    saveCookiePreferences(preferences);
    
    // Hide banner with animation
    cookieBanner.classList.remove('show');
    setTimeout(() => {
      cookieBanner.style.display = 'none';
    }, 500);
  });

  // Preferences button click handler (if implemented)
  if (preferencesButton) {
    preferencesButton.addEventListener('click', () => {
      // This could open a modal with detailed cookie preferences
      // For this basic implementation, we'll just log a message
      console.log('Preferences button clicked');
    });
  }

  // Listen for preference change events from other pages
  window.addEventListener('storage', (event) => {
    if (event.key === 'cookieConsent' && event.newValue !== null) {
      applyCookiePreferences(JSON.parse(event.newValue));
    }
  });
}

/**
 * Save cookie preferences to localStorage
 * @param {Object} preferences - Cookie preferences object
 */
function saveCookiePreferences(preferences) {
  localStorage.setItem('cookieConsent', JSON.stringify(preferences));
  applyCookiePreferences(preferences);
}

/**
 * Apply cookie preferences by enabling/disabling relevant scripts
 * @param {Object} preferences - Cookie preferences object
 */
function applyCookiePreferences(preferences) {
  // Apply essential cookies (always allowed)
  
  // Apply analytics cookies if allowed
  if (preferences.analytics) {
    enableAnalytics();
  } else {
    disableAnalytics();
  }
  
  // Apply marketing cookies if allowed
  if (preferences.marketing) {
    enableMarketing();
  } else {
    disableMarketing();
  }

  // Dispatch event for other scripts to react to cookie preferences
  document.dispatchEvent(new CustomEvent('cookiePreferencesUpdated', { 
    detail: preferences 
  }));
}

/**
 * Enable analytics tracking
 */
function enableAnalytics() {
  // Implementation will vary based on analytics provider
  // Below is sample implementation for Google Analytics
  
  // Load Google Analytics script if it doesn't exist
  if (!document.getElementById('ga-script')) {
    // This is just a placeholder - actual implementation would use the site's GA ID
    /* 
    const gaScript = document.createElement('script');
    gaScript.id = 'ga-script';
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
    */
  }
  
  console.log('Analytics enabled');
}

/**
 * Disable analytics tracking
 */
function disableAnalytics() {
  // Remove Google Analytics cookies if they exist
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    
    // Look for Google Analytics cookies
    if (cookie.indexOf('_ga') === 0 || 
        cookie.indexOf('_gid') === 0 || 
        cookie.indexOf('_gat') === 0) {
      
      // Extract cookie name
      const cookieName = cookie.split('=')[0];
      
      // Delete the cookie by setting expiration in the past
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }
  
  console.log('Analytics disabled');
}

/**
 * Enable marketing features
 */
function enableMarketing() {
  // Implementation will vary based on marketing tools
  // Below is a sample implementation for Facebook Pixel
  
  /* 
  if (!document.getElementById('fb-pixel')) {
    // Facebook Pixel code (example)
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.id = 'fb-pixel';
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'PIXEL_ID');
    fbq('track', 'PageView');
  }
  */
  
  console.log('Marketing features enabled');
}

/**
 * Disable marketing features
 */
function disableMarketing() {
  // Clear Facebook Pixel cookies
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    
    // Look for Facebook cookies
    if (cookie.indexOf('_fbp') === 0 || 
        cookie.indexOf('_fbc') === 0) {
      
      // Extract cookie name
      const cookieName = cookie.split('=')[0];
      
      // Delete the cookie
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }
  
  console.log('Marketing features disabled');
}

/**
 * Check if cookies are enabled in the browser
 * @returns {boolean} - True if cookies are enabled
 */
function areCookiesEnabled() {
  try {
    // Try to set a test cookie
    document.cookie = "testcookie=1; SameSite=Strict; Secure";
    const cookieEnabled = document.cookie.indexOf("testcookie") !== -1;
    
    // Clean up the test cookie
    document.cookie = "testcookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    return cookieEnabled;
  } catch (e) {
    // If an error occurs, assume cookies are not enabled
    return false;
  }
}

/**
 * Open cookie preferences modal or page
 * For a more advanced implementation
 */
function openCookiePreferences() {
  // This function could show a modal with detailed cookie settings
  // For this basic implementation, we'll just log a message
  console.log('Cookie preferences opened');
  
  // An implementation could look like this:
  // 1. Show modal with checkboxes for each cookie category
  // 2. Pre-fill based on existing preferences
  // 3. Save preferences when user confirms
}

// Expose functions to global scope for use in other scripts if needed
window.cookieConsent = {
  openPreferences: openCookiePreferences,
  savePreferences: saveCookiePreferences,
  getPreferences: function() {
    const preferences = localStorage.getItem('cookieConsent');
    return preferences ? JSON.parse(preferences) : null;
  }
};