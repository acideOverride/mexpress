<template>
  <div class="settings-container">
    <div class="page-header">
      <h1>Settings</h1>
      <p class="section-description">Manage your application settings</p>
    </div>

    <div class="settings-grid">
      <!-- Account Settings Section -->
      <div class="settings-section">
        <div class="section-header">
          <h2>Account Settings</h2>
          <p>Manage your account preferences</p>
        </div>

        <div class="card">
          <div class="setting-item">
            <div class="setting-info">
              <h3>User Profile</h3>
              <p>Update your name, email, and profile information</p>
            </div>
            <button class="btn-primary">Edit Profile</button>
          </div>

          <div class="setting-divider"></div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Password</h3>
              <p>Change your password</p>
            </div>
            <button class="btn-primary">Change Password</button>
          </div>

          <div class="setting-divider"></div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your account</p>
            </div>
            <button class="btn-outline">Set Up</button>
          </div>
        </div>
      </div>

      <!-- Notification Settings Section -->
      <div class="settings-section">
        <div class="section-header">
          <h2>Notification Settings</h2>
          <p>Configure how and when you receive notifications</p>
        </div>

        <div class="card">
          <div class="setting-item">
            <div class="setting-info">
              <h3>Email Notifications</h3>
              <p>Receive updates and alerts via email</p>
            </div>
            <div class="toggle-switch">
              <input type="checkbox" id="email-toggle" class="toggle-input" checked />
              <label for="email-toggle" class="toggle-label"></label>
            </div>
          </div>

          <div class="setting-divider"></div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Browser Notifications</h3>
              <p>Receive notifications in your browser</p>
            </div>
            <div class="toggle-switch">
              <input type="checkbox" id="browser-toggle" class="toggle-input" />
              <label for="browser-toggle" class="toggle-label"></label>
            </div>
          </div>

          <div class="setting-divider"></div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>SMS Notifications</h3>
              <p>Receive important alerts via text message</p>
            </div>
            <div class="toggle-switch">
              <input type="checkbox" id="sms-toggle" class="toggle-input" />
              <label for="sms-toggle" class="toggle-label"></label>
            </div>
          </div>
        </div>
      </div>

      <!-- Application Settings Section -->
      <div class="settings-section">
        <div class="section-header">
          <h2>Application Settings</h2>
          <p>Configure the application to match your preferences</p>
        </div>

        <div class="card">
          <div class="setting-item">
            <div class="setting-info">
              <h3>Theme</h3>
              <p>Choose between light and dark theme</p>
            </div>
            <select class="select-input">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div class="setting-divider"></div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Language</h3>
              <p>Select your preferred language</p>
            </div>
            <select class="select-input">
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
            </select>
          </div>

          <div class="setting-divider"></div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Date Format</h3>
              <p>Choose how dates are displayed</p>
            </div>
            <select class="select-input">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Integration Settings Section -->
      <div class="settings-section">
        <div class="section-header">
          <h2>API Integrations</h2>
          <p>Manage connections with external services</p>
        </div>

        <div class="card">
          <div class="setting-item">
            <div class="setting-info">
              <h3>Ringover Integration</h3>
              <p>Connect your Ringover phone system</p>
              <div class="integration-status connected">
                <span class="status-indicator"></span>
                Connected
              </div>
            </div>
            <button class="btn-outline">Configure</button>
          </div>

          <div class="setting-divider"></div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Hiboutik Integration</h3>
              <p>Connect your Hiboutik POS system</p>
              <div class="integration-status connected">
                <span class="status-indicator"></span>
                Connected
              </div>
            </div>
            <button class="btn-outline">Configure</button>
          </div>

          <div class="setting-divider"></div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Brevo Email Integration</h3>
              <p>Configure email marketing integration</p>
              <div class="integration-status disconnected">
                <span class="status-indicator"></span>
                Disconnected
              </div>
            </div>
            <button class="btn-primary">Connect</button>
          </div>
        </div>
      </div>
    </div>

    <div class="save-section">
      <button class="btn-primary" @click="saveSettings">Save Changes</button>
      <button class="btn-outline" @click="resetSettings">Reset to Defaults</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Placeholder functions for saving/resetting settings
const saveSettings = () => {
  alert('Settings saved successfully!');
};

const resetSettings = () => {
  if (confirm('Are you sure you want to reset all settings to default values?')) {
    alert('Settings have been reset to defaults');
  }
};
</script>

<style scoped>
.settings-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.section-description {
  color: #6b7280;
  margin-top: 0;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 1.5rem;
}

.settings-section {
  margin-bottom: 1.5rem;
}

.section-header {
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
}

.section-header p {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0;
}

.card {
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.setting-item {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-info {
  flex: 1;
}

.setting-info h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem;
}

.setting-info p {
  color: #6b7280;
  font-size: 0.75rem;
  margin: 0;
}

.setting-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 0 1rem;
}

/* Toggle switch */
.toggle-switch {
  position: relative;
  width: 44px;
  height: 22px;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e5e7eb;
  transition: 0.4s;
  border-radius: 34px;
}

.toggle-label:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

.toggle-input:checked + .toggle-label {
  background-color: #2563eb;
}

.toggle-input:checked + .toggle-label:before {
  transform: translateX(22px);
}

/* Select Input */
.select-input {
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.375rem 2rem 0.375rem 0.75rem;
  font-size: 0.875rem;
  color: #111827;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
}

/* Integration Status */
.integration-status {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.connected {
  color: #059669;
}

.connected .status-indicator {
  background-color: #10b981;
}

.disconnected {
  color: #b91c1c;
}

.disconnected .status-indicator {
  background-color: #ef4444;
}

/* Save Section */
.save-section {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Button Styles */
.btn-primary, .btn-outline {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-outline {
  background-color: white;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-outline:hover {
  background-color: #f9fafb;
  color: #4b5563;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .setting-info {
    margin-bottom: 1rem;
  }

  .save-section {
    flex-direction: column;
  }

  .btn-primary, .btn-outline {
    width: 100%;
  }
}
</style>