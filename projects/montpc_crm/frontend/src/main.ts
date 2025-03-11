import { createApp } from 'vue'
import App from './App.vue'

console.log('Vue application starting')

const app = createApp(App)
app.mount('#app')

console.log('Vue application mounted successfully')