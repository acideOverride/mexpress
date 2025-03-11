// MontPC CRM Vue Entry Point with EXTENSIVE error logging
import { createApp, version as vueVersion } from 'vue'
import router from './vue-components/router'

console.log('===== DETAILED DEBUG INFO =====')
console.log('Vue Version:', vueVersion)
console.log('Environment:', import.meta.env.MODE)
console.log('Base URL:', import.meta.env.BASE_URL)
console.log('Current URL:', window.location.href)
console.log('Current script:', import.meta.url)
console.log('=============================')

// Use standard ESM imports
console.log('Attempting to import App.vue...')
import App from './vue-components/App.vue'
console.log('App.vue imported successfully')

// Check if App is a valid component
if (!App) {
  const error = new Error('App.vue was imported but returned undefined or null')
  console.error('CRITICAL ERROR with App.vue:', error)
  document.body.innerHTML = `
    <div style="padding: 20px; background: #fee; color: #c00; border: 2px solid #f88; margin: 20px; border-radius: 8px">
      <h2>Vue Component Error</h2>
      <p>App.vue was imported but returned ${App}</p>
    </div>
  `
  throw error
}

console.log('Creating Vue app instance...')
// Create the Vue app instance
const app = createApp(App)

// Add router to application
console.log('Installing Vue Router...')
app.use(router)
console.log('Vue Router installed successfully')

// Log Vue app creation
console.log('Vue app created successfully')

// Function to hide fallback loading UI
const hideFallback = () => {
  const fallback = document.getElementById('fallback')
  if (fallback) {
    console.log('Hiding fallback UI')
    fallback.style.display = 'none'
  } else {
    console.warn('Fallback element not found when trying to hide it')
  }
}

// Function to show fallback if errors occur
const showFallback = () => {
  const fallback = document.getElementById('fallback')
  if (fallback) {
    console.log('Showing fallback UI due to error')
    fallback.style.display = 'block'
    
    // Add error indication
    fallback.classList.add('error')
  } else {
    console.warn('Fallback element not found when trying to show it')
  }
}

// Register global error handler with improved error reporting
app.config.errorHandler = (err, vm, info) => {
  console.error('===== VUE ERROR DETAILS =====')
  console.error('Error:', err)
  console.error('Error Message:', err.message)
  console.error('Error Stack:', err.stack)
  console.error('Component:', vm)
  console.error('Info:', info)
  console.error('===========================')
  
  // Show the fallback message again if error occurs
  showFallback()
  
  // Display a more user-friendly error message in the fallback
  const fallbackMessage = document.querySelector('#fallback p')
  if (fallbackMessage) {
    fallbackMessage.textContent = `Error: ${err.message || 'Unknown error occurred'}`
  }
  
  // Add error to page for visibility
  const errorDiv = document.createElement('div')
  errorDiv.style.padding = '20px'
  errorDiv.style.margin = '20px'
  errorDiv.style.backgroundColor = '#fee'
  errorDiv.style.color = '#c00'
  errorDiv.style.border = '2px solid #f88'
  errorDiv.style.borderRadius = '8px'
  errorDiv.innerHTML = `
    <h2>Vue Error</h2>
    <p>${err.message}</p>
    <pre>${err.stack}</pre>
  `
  document.body.appendChild(errorDiv)
}

// Find mount point with detailed logging
console.log('Looking for mount point...')
let mountPoint = document.getElementById('app-vue')
console.log('Mount point #app-vue found?', !!mountPoint)

if (!mountPoint) {
  mountPoint = document.getElementById('app')
  console.log('Mount point #app found?', !!mountPoint)
  
  if (mountPoint) {
    console.log('Using #app as mount point (fallback)')
  } else {
    console.warn('No mount point found, creating one')
    mountPoint = document.createElement('div')
    mountPoint.id = 'app-vue'
    document.body.appendChild(mountPoint)
    console.log('Created new mount point with ID app-vue')
  }
}

// Try to mount with detailed error handling
console.log('Attempting to mount Vue app...')
try {
  app.mount(mountPoint)
  console.log('Vue app mounted successfully!')
  
  // Hide the loading UI
  hideFallback()
  
  // Make app globally available for debugging
  // @ts-ignore
  window.vueApp = app
  console.log('Vue app exported to window.vueApp for debugging')
} catch (mountError) {
  console.error('MOUNT ERROR:', mountError)
  document.body.innerHTML = `
    <div style="padding: 20px; background: #fee; color: #c00; border: 2px solid #f88; margin: 20px; border-radius: 8px">
      <h2>Vue Mount Error</h2>
      <p>${mountError.message}</p>
      <pre>${mountError.stack}</pre>
    </div>
  `
}

// Listen for messages from frame for debugging
window.addEventListener('message', (event) => {
  console.log('Received message:', event.data)
  if (event.data === 'vue-app-check') {
    console.log('Responding to vue-app-check message')
    event.source?.postMessage('vue-app-ready', '*')
  }
})

// Log when the window is fully loaded
window.addEventListener('load', () => {
  console.log('Window fully loaded')
  console.log('Vue app status:', !!window.vueApp ? 'available' : 'not available')
})

// Export the app instance
export default app
