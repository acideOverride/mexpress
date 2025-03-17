# MontPC.com Google reCAPTCHA Integration Checklist

> **IMPORTANT**: This is a small, focused implementation checklist for adding Google reCAPTCHA to the Contact Form. This checklist exists outside the general AMTC workflow due to its focused scope and builds upon the completed Contact Form Backend (TASK-MONT-001).

## Current Status

- **Integration Start Date**: 2025-03-17
- **Expected Completion**: 2025-03-21
- **Priority**: Medium
- **Related Tasks**: 
  - TASK-MONT-001 (Contact Form Backend) - ✅ 100% Complete
  - MODULE-EMAIL-INTEGRATION - ✅ 100% Complete

## Implementation Checklist

### Phase 1: Requirements Analysis

- [ ] Google reCAPTCHA account setup:
  - [ ] Create Google reCAPTCHA v2 site
  - [ ] Configure domain settings for montpc.com
  - [ ] Generate site key (for frontend) and secret key (for backend)
  - [ ] Choose "I'm not a robot" Checkbox reCAPTCHA v2

- [ ] Identify integration points:
  - [ ] Review HTML contact form structure in `index.html`
  - [ ] Review JavaScript form validation in `main.js`
  - [ ] Review backend controller in `controllers/contactController.js`
  - [ ] Review form submission validation schema (Joi)

### Phase 2: Frontend Implementation

- [ ] Add reCAPTCHA JavaScript library to `index.html`:
  ```html
  <script src="https://www.google.com/recaptcha/api.js" async defer></script>
  ```

- [ ] Add reCAPTCHA widget to contact form:
  ```html
  <div class="form-group full-width">
    <div class="g-recaptcha" data-sitekey="YOUR_SITE_KEY" data-callback="onRecaptchaVerified"></div>
    <div class="recaptcha-error" id="recaptcha-error" style="display: none;">Veuillez cocher la case reCAPTCHA.</div>
  </div>
  ```

- [ ] Update JavaScript form validation:
  - [ ] Modify `initializeFormValidation()` function in `main.js`
  - [ ] Add reCAPTCHA verification check:
    ```javascript
    // Check if reCAPTCHA was completed
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      isValid = false;
      document.getElementById('recaptcha-error').style.display = 'block';
    } else {
      document.getElementById('recaptcha-error').style.display = 'none';
    }
    ```
  - [ ] Ensure reCAPTCHA token is included in form submission:
    ```javascript
    const formData = new FormData(form);
    formData.append('g-recaptcha-response', recaptchaResponse);
    ```

- [ ] Add CSS styling for reCAPTCHA elements:
  ```css
  /* reCAPTCHA styling */
  .g-recaptcha {
    margin: var(--spacing-md) 0;
  }
  
  .recaptcha-error {
    color: #e74c3c;
    font-size: 0.85rem;
    margin-top: -0.5rem;
    margin-bottom: var(--spacing-md);
  }
  ```

### Phase 3: Backend Implementation

- [ ] Install required packages:
  ```bash
  npm install axios --save
  ```

- [ ] Update validation schema in `contactController.js`:
  ```javascript
  // Add reCAPTCHA token validation to schema
  const contactSchema = Joi.object({
    // Existing validation rules...
    "g-recaptcha-response": Joi.string().required()
      .messages({
        'string.empty': 'La vérification reCAPTCHA est requise',
        'any.required': 'La vérification reCAPTCHA est requise'
      })
  });
  ```

- [ ] Add reCAPTCHA verification function:
  ```javascript
  /**
   * Verify reCAPTCHA token with Google API
   * @param {string} token - The reCAPTCHA token to verify
   * @returns {Promise<boolean>} - True if verification succeeds, false otherwise
   */
  async function verifyRecaptcha(token) {
    try {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      const url = 'https://www.google.com/recaptcha/api/siteverify';
      
      const response = await axios.post(url, null, {
        params: {
          secret: secretKey,
          response: token
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      return response.data.success;
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return false;
    }
  }
  ```

- [ ] Update form submission controller to verify reCAPTCHA:
  ```javascript
  exports.submitForm = async (req, res, next) => {
    try {
      // Validate form input
      const { error, value } = contactSchema.validate(req.body, { abortEarly: false });
      
      if (error) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Erreur de validation du formulaire',
            details: error.details.map(detail => ({
              field: detail.path[0],
              message: detail.message
            }))
          }
        });
      }
      
      // Verify reCAPTCHA
      const recaptchaToken = req.body['g-recaptcha-response'];
      const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
      
      if (!isRecaptchaValid) {
        return res.status(400).json({
          error: {
            code: 'RECAPTCHA_ERROR',
            message: 'La vérification reCAPTCHA a échoué',
            details: [{
              field: 'recaptcha',
              message: 'Échec de la vérification reCAPTCHA, veuillez réessayer'
            }]
          }
        });
      }
      
      // Existing form processing logic...
    } catch (err) {
      console.error('Error in form submission:', err);
      next(err);
    }
  };
  ```

- [ ] Update environment variable configuration:
  ```javascript
  // Add to .env file
  RECAPTCHA_SITE_KEY=your_site_key
  RECAPTCHA_SECRET_KEY=your_secret_key
  ```

### Phase 4: Testing

- [ ] Unit tests:
  - [ ] Update `contact-form.test.js` to include reCAPTCHA testing:
    ```javascript
    // Mock axios for reCAPTCHA verification
    jest.mock('axios');
    
    // Test for missing reCAPTCHA token
    test('should return 400 when reCAPTCHA token is missing', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
    
    // Test for invalid reCAPTCHA token
    test('should return 400 when reCAPTCHA verification fails', async () => {
      // Mock axios to simulate failed verification
      axios.post.mockResolvedValue({
        data: { success: false }
      });
      
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message',
          'g-recaptcha-response': 'invalid-token'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('RECAPTCHA_ERROR');
    });
    
    // Test for valid reCAPTCHA token
    test('should process form when reCAPTCHA verification succeeds', async () => {
      // Mock axios to simulate successful verification
      axios.post.mockResolvedValue({
        data: { success: true }
      });
      
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message',
          'g-recaptcha-response': 'valid-token'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
    ```

- [ ] Manual testing:
  - [ ] Test contact form with invalid reCAPTCHA (not checked)
  - [ ] Test contact form with valid reCAPTCHA
  - [ ] Test error messages and UI feedback
  - [ ] Test form resubmission after reCAPTCHA expiration
  - [ ] Test compatibility across different browsers
  - [ ] Test mobile responsiveness of reCAPTCHA widget
  - [ ] Test with screen readers for accessibility

### Phase 5: Finalization

- [ ] Update documentation:
  - [ ] Update README.md with reCAPTCHA integration information
  - [ ] Document environment variables for reCAPTCHA
  - [ ] Create documentation for developers about reCAPTCHA integration

- [ ] Final deployment:
  - [ ] Deploy updated contact form frontend and backend
  - [ ] Verify reCAPTCHA is working in production
  - [ ] Monitor for any issues with bot detection or false positives

## Implementation Details

### Google reCAPTCHA Configuration

```javascript
// reCAPTCHA v2 Configuration
const recaptchaConfig = {
  siteKey: process.env.RECAPTCHA_SITE_KEY,
  secretKey: process.env.RECAPTCHA_SECRET_KEY,
  verifyUrl: 'https://www.google.com/recaptcha/api/siteverify',
  type: 'checkbox', // "I'm not a robot" checkbox style
  theme: 'light',
  size: 'normal',
  language: 'fr' // French language for interface
};
```

### Frontend Implementation Code Snippet

```html
<!-- reCAPTCHA widget placement -->
<div class="form-group full-width">
  <div class="g-recaptcha" 
       data-sitekey="RECAPTCHA_SITE_KEY"
       data-theme="light"
       data-size="normal"
       data-callback="onRecaptchaVerified"
       data-expired-callback="onRecaptchaExpired"></div>
  <div class="recaptcha-error" id="recaptcha-error" style="display: none;">
    Veuillez cocher la case reCAPTCHA.
  </div>
</div>
```

```javascript
// reCAPTCHA callback functions
function onRecaptchaVerified(token) {
  document.getElementById('recaptcha-error').style.display = 'none';
}

function onRecaptchaExpired() {
  document.getElementById('recaptcha-error').style.display = 'block';
}
```

### Backend Verification Code Snippet

```javascript
/**
 * Verify reCAPTCHA token with Google API
 * @param {string} token - The reCAPTCHA token to verify
 * @param {string} remoteIp - Optional IP address of the user
 * @returns {Promise<boolean>} - True if verification succeeds, false otherwise
 */
async function verifyRecaptcha(token, remoteIp = null) {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const url = 'https://www.google.com/recaptcha/api/siteverify';
    
    const params = {
      secret: secretKey,
      response: token
    };
    
    // Add user IP if available (optional, improves accuracy)
    if (remoteIp) {
      params.remoteip = remoteIp;
    }
    
    const response = await axios.post(url, null, {
      params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    // Log detailed verification results in development
    if (process.env.NODE_ENV === 'development') {
      console.log('reCAPTCHA verification response:', response.data);
    }
    
    // Check for success and minimum score if using v3
    return response.data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    // Return false on any error to enforce strict verification
    return false;
  }
}
```

## Configuration Reference

### Environment Variables

```env
# reCAPTCHA Configuration
RECAPTCHA_SITE_KEY=your_site_key_from_google
RECAPTCHA_SECRET_KEY=your_secret_key_from_google
```

### Integration with Existing Email Service

The reCAPTCHA verification will be integrated with the existing email service as a pre-verification step. The implementation will not modify the email sending logic, only add the reCAPTCHA verification before the existing validation.

```javascript
exports.submitForm = async (req, res, next) => {
  try {
    // 1. Validate form input with Joi
    // 2. Verify reCAPTCHA token (NEW)
    // 3. Process email with @mexpress/email-service (UNCHANGED)
    // 4. Return response to client
  } catch (err) {
    // Error handling
  }
};
```

## Implementation Notes

### Security Considerations

1. **Secret Key Protection**:
   - Keep the secret key secure in environment variables
   - Never expose the secret key in client-side code
   - Use secure environment variable management in production

2. **IP Address Verification**:
   - Optionally include the user's IP address for improved verification
   - Consider privacy implications and GDPR compliance

3. **Fallback Mechanisms**:
   - Implement fallback validation for users with JavaScript disabled
   - Add server-side timeout checking for token validation

4. **Score Thresholds (for reCAPTCHA v3)**:
   - Set appropriate score thresholds based on your risk tolerance
   - Monitor false positives and adjust thresholds accordingly

### Accessibility Considerations

1. The reCAPTCHA widget includes built-in accessibility features
2. Screen readers can interact with the checkbox widget
3. Include clear error messaging for failed verification
4. Consider adding additional instructions for users with disabilities

## Resources

- Google reCAPTCHA Documentation: https://developers.google.com/recaptcha/docs/display
- Contact Form Backend: `/opt/mExpress/docs/montpc_com/__mocks__/accepted/v3/fr/CHECKLIST.md`
- Email Service Integration: `/opt/mExpress/docs/montpc_com/__mocks__/accepted/v3/fr/_docs/MODULE_CHECKLIST.md`

## Notes

- This integration builds upon the existing contact form implementation
- All security best practices are followed
- The implementation uses reCAPTCHA v2 Checkbox for better user experience
- The module is designed to gracefully degrade if reCAPTCHA services are unavailable
- The implementation includes comprehensive testing for frontend and backend functionality
- All user-facing text is in French, maintaining the site's localization