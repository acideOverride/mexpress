// Minimal Vue app to test functionality
import { createApp, h } from 'vue'

// Define the simplest app possible
const app = createApp({
  render() {
    return h('div', { style: 'padding: 20px; font-family: sans-serif;' }, [
      h('h1', 'Hello Vue!'),
      h('p', 'If you can see this message, Vue.js is working correctly.')
    ])
  }
})

// Mount to app container
const container = document.getElementById('app-vue')
if (container) {
  app.mount(container)
  console.log('✅ Minimal Vue app mounted successfully')
} else {
  console.error('❌ Could not find #app-vue element')
}