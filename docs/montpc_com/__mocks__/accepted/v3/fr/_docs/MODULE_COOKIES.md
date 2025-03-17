# MontPC.com Cookie Consent Module

> **IMPORTANT**: This is a focused implementation checklist for adding a basic but legally compliant cookie consent module to the MontPC website. This checklist exists outside the general AMTC workflow due to its focused scope and temporary nature.

## Current Status

- **Implementation Start Date**: 2025-03-17
- **Expected Completion**: 2025-03-19
- **Priority**: High (Legal Requirement)
- **Related Documents**: 
  - Privacy Policy: `/opt/mExpress/docs/montpc_com/__mocks__/accepted/v3/fr/legals/politique-confidentialite.md`

## Legal Requirements

- [x] Review French and EU cookie consent laws (GDPR, CNIL guidelines)
- [x] Identify minimal requirements for legal compliance:
  - Must inform users about cookie usage
  - Must obtain consent before setting non-essential cookies
  - Must allow users to refuse non-essential cookies
  - Must provide access to detailed privacy policy
  - Must allow users to change preferences later

## Implementation Checklist

### Phase 1: Analysis & Planning

- [ ] Review current website cookie usage:
  - [ ] Identify essential cookies (if any)
  - [ ] Identify analytics/tracking cookies
  - [ ] Identify third-party cookies (social media, etc.)

- [ ] Define cookie categories:
  - [ ] Essential (required for site functionality)
  - [ ] Analytics (optional, for site improvement)
  - [ ] Marketing/Tracking (optional, for personalized content)

- [ ] Review existing code structure:
  - [ ] Identify best integration points
  - [ ] Ensure compatibility with theme toggle feature
  - [ ] Check for existing localStorage/cookie usage

### Phase 2: UI Component Implementation

- [ ] Create cookie banner HTML:
  ```html
  <div id="cookie-consent" class="cookie-banner">
    <div class="cookie-content">
      <p>Ce site utilise des cookies pour améliorer votre expérience. Veuillez confirmer votre préférence.</p>
      <div class="cookie-actions">
        <a href="/legals/politique-confidentialite.html" class="cookie-policy-link">En savoir plus</a>
        <button id="cookie-reject" class="btn secondary-btn">Refuser</button>
        <button id="cookie-accept" class="btn primary-btn">Accepter</button>
      </div>
    </div>
  </div>
  ```

- [ ] Add CSS styling:
  ```css
  /* Cookie Consent Banner */
  .cookie-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--background);
    box-shadow: var(--shadow-lg);
    border-top: 1px solid var(--border);
    padding: var(--spacing-md);
    z-index: 1000;
    display: none;
  }

  .cookie-content {
    max-width: var(--container-max-width);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }

  .cookie-content p {
    margin: 0;
    flex: 1;
  }

  .cookie-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .cookie-policy-link {
    margin-right: var(--spacing-md);
    font-size: 0.9rem;
  }

  /* Responsive adjustment */
  @media (max-width: 768px) {
    .cookie-content {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .cookie-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
  ```

### Phase 3: JavaScript Implementation

- [ ] Create cookie.js file:
  ```javascript
  /**
   * MontPC Cookie Consent Module
   * Basic cookie consent management
   */
  
  document.addEventListener('DOMContentLoaded', () => {
    initializeCookieConsent();
  });
  
  /**
   * Initialize cookie consent functionality
   */
  function initializeCookieConsent() {
    const cookieBanner = document.getElementById('cookie-consent');
    const acceptButton = document.getElementById('cookie-accept');
    const rejectButton = document.getElementById('cookie-reject');
    
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (cookieConsent === null) {
      // Show banner if no choice has been made
      cookieBanner.style.display = 'block';
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
      
      // Hide banner
      cookieBanner.style.display = 'none';
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
      
      // Hide banner
      cookieBanner.style.display = 'none';
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
  }
  
  /**
   * Enable analytics tracking
   */
  function enableAnalytics() {
    // Implementation will vary based on analytics provider
    // For example, initializing Google Analytics
    console.log('Analytics enabled');
  }
  
  /**
   * Disable analytics tracking
   */
  function disableAnalytics() {
    // Implementation will vary based on analytics provider
    // For example, removing Google Analytics cookies
    console.log('Analytics disabled');
  }
  
  /**
   * Enable marketing features
   */
  function enableMarketing() {
    // Implementation will vary based on marketing tools
    console.log('Marketing features enabled');
  }
  
  /**
   * Disable marketing features
   */
  function disableMarketing() {
    // Implementation will vary based on marketing tools
    console.log('Marketing features disabled');
  }
  ```

### Phase 4: Integration

- [ ] Add cookie banner HTML to index.html:
  - [ ] Place before closing `</body>` tag
  - [ ] Ensure z-index is appropriate

- [ ] Add cookie.js script reference:
  ```html
  <script src="js/cookie.js"></script>
  ```

- [ ] Update CSS:
  - [ ] Add cookie banner styles to existing CSS
  - [ ] Ensure dark/light mode compatibility

- [ ] Update Privacy Policy:
  - [ ] Verify cookie section is accurate
  - [ ] Include description of consent mechanism
  - [ ] Describe cookie categories and purposes

### Phase 5: Testing

- [ ] Cross-browser testing:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

- [ ] Functionality testing:
  - [ ] Banner appears on first visit
  - [ ] Accept button works correctly
  - [ ] Reject button works correctly
  - [ ] Preferences are saved correctly
  - [ ] Banner doesn't reappear after choice is made

- [ ] Mobile/responsive testing:
  - [ ] Banner displays correctly on mobile
  - [ ] Buttons are usable on small screens
  - [ ] Layout adapts properly

### Phase 6: Legal Verification

- [ ] Final check against legal requirements:
  - [ ] Confirm explicit consent is obtained
  - [ ] Verify policy link is accessible
  - [ ] Ensure non-essential cookies aren't set before consent

- [ ] Optional: Add preference management page:
  - [ ] Create separate page for managing cookie preferences
  - [ ] Add link to footer for easy access

## Implementation Details

### Cookie Categories

1. **Essential Cookies**:
   - Required for site functionality
   - No consent needed (always enabled)
   - Examples: session cookies, load balancing

2. **Analytics Cookies**:
   - Used to analyze site usage and performance
   - Consent required
   - Examples: Google Analytics, Matomo

3. **Marketing/Tracking Cookies**:
   - Used for advertising and tracking
   - Consent required
   - Examples: social media pixels, ad networks

### Integration with Existing Theme System

The cookie banner will use CSS variables already defined in the site's stylesheet:

```css
/* Example of using existing variables */
.cookie-banner {
  background-color: var(--background);
  color: var(--text-primary);
  border-top: 1px solid var(--border);
}

/* Dark mode compatibility is automatic */
.dark-mode .cookie-banner {
  /* Variables change automatically in dark mode */
}
```

### LocalStorage Structure

```javascript
// Example localStorage entry
{
  "essential": true,  // Always true
  "analytics": true,  // User's choice
  "marketing": false, // User's choice
  "timestamp": "2025-03-17T14:30:00.000Z" // When choice was made
}
```

## Legal Reference

### Minimal GDPR & CNIL Requirements

1. **Informed Consent**:
   - Users must be informed about cookie usage
   - Information must be clear and understandable
   - Purpose of cookies must be explained

2. **Prior Consent**:
   - Consent must be obtained before non-essential cookies are set
   - Continuing to browse is NOT considered consent
   - Explicit action (button click) is required

3. **Right to Refuse**:
   - Users must be able to refuse non-essential cookies
   - Refusing should be as easy as accepting
   - Site must remain functional if cookies are refused

4. **Preference Management**:
   - Users should be able to change preferences later
   - Preferences should be stored and respected

## Resources

- Privacy Policy: `/opt/mExpress/docs/montpc_com/__mocks__/accepted/v3/fr/legals/politique-confidentialite.md`
- CNIL Guidelines: https://www.cnil.fr/fr/cookies-et-traceurs-que-dit-la-loi
- GDPR Cookie Consent: https://gdpr.eu/cookies/

## Notes

- This is a basic implementation that meets minimal legal requirements
- More sophisticated solutions (like a detailed cookie preference center) can be implemented later
- The module uses localStorage instead of cookies to store preferences
- Integration with actual analytics will depend on which tools the site uses
- This module is designed to be lightweight and simple to implement
- For a more comprehensive solution, consider dedicated tools like OneTrust, CookieBot, or CookieYes