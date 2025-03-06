/**
 * API interceptor setup module
 */

const { setupAuthInterceptor } = require('./auth');
const { setupErrorInterceptor } = require('./error');

/**
 * Setup all API interceptors
 * @param {Object} axiosInstance - The axios instance to configure
 */
function setupInterceptors(axiosInstance) {
  // Setup auth interceptor first
  setupAuthInterceptor(axiosInstance);
  
  // Setup error interceptor last so it can handle auth errors too
  setupErrorInterceptor(axiosInstance);
}

module.exports = {
  setupInterceptors
};