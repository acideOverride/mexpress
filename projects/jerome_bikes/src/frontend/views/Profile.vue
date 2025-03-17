<template>
  <div class="profile-page">
    <div class="container">
      <div v-if="loading" class="loading-indicator">
        <div class="spinner"></div>
        <p>Loading your profile...</p>
      </div>
      <div v-else-if="user" class="profile-container">
        <div class="profile-section">
          <h1 class="profile-title">My Profile</h1>
          
          <div v-if="editMode" class="profile-edit">
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-group">
                <label for="name" class="form-label">Name</label>
                <input 
                  id="name" 
                  v-model="form.name" 
                  class="form-control" 
                  required 
                />
              </div>
              
              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input 
                  id="email" 
                  v-model="form.email" 
                  type="email" 
                  class="form-control" 
                  required 
                />
              </div>
              
              <div class="form-group">
                <label for="phone" class="form-label">Phone (optional)</label>
                <input 
                  id="phone" 
                  v-model="form.phone" 
                  type="tel" 
                  class="form-control" 
                />
              </div>
              
              <div v-if="formError" class="error-message">
                {{ formError }}
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn btn-primary" :disabled="updating">
                  {{ updating ? 'Saving...' : 'Save Changes' }}
                </button>
                <button 
                  type="button" 
                  class="btn btn-outline" 
                  @click="cancelEdit"
                  :disabled="updating"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          
          <div v-else class="profile-view">
            <div class="profile-card">
              <div class="profile-avatar">
                <div class="avatar-placeholder">
                  {{ userInitials }}
                </div>
              </div>
              
              <div class="profile-details">
                <div class="profile-field">
                  <span class="field-label">Name:</span>
                  <span class="field-value">{{ user.name }}</span>
                </div>
                
                <div class="profile-field">
                  <span class="field-label">Email:</span>
                  <span class="field-value">{{ user.email }}</span>
                </div>
                
                <div v-if="user.phone" class="profile-field">
                  <span class="field-label">Phone:</span>
                  <span class="field-value">{{ user.phone }}</span>
                </div>
                
                <div class="profile-field">
                  <span class="field-label">Account Type:</span>
                  <span class="field-value">{{ userRole }}</span>
                </div>
              </div>
            </div>
            
            <button class="btn btn-primary" @click="startEdit">
              Edit Profile
            </button>
          </div>
        </div>
        
        <div class="profile-section password-change-section">
          <h2>Change Password</h2>
          
          <form @submit.prevent="changePassword" class="profile-form">
            <div class="form-group">
              <label for="current-password" class="form-label">Current Password</label>
              <input 
                id="current-password" 
                v-model="passwordForm.oldPassword" 
                type="password" 
                class="form-control" 
                required 
              />
            </div>
            
            <div class="form-group">
              <label for="new-password" class="form-label">New Password</label>
              <input 
                id="new-password" 
                v-model="passwordForm.newPassword" 
                type="password" 
                class="form-control" 
                required 
                minlength="8"
              />
              <small>Must be at least 8 characters long</small>
            </div>
            
            <div class="form-group">
              <label for="confirm-password" class="form-label">Confirm New Password</label>
              <input 
                id="confirm-password" 
                v-model="passwordForm.confirmPassword" 
                type="password" 
                class="form-control" 
                required 
              />
            </div>
            
            <div v-if="passwordError" class="error-message">
              {{ passwordError }}
            </div>
            
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="changingPassword"
            >
              {{ changingPassword ? 'Changing Password...' : 'Change Password' }}
            </button>
          </form>
        </div>
        
        <div class="profile-section">
          <h2>Active Reservations</h2>
          
          <div class="reservation-list">
            <p>You don't have any active reservations.</p>
            <router-link to="/reservations" class="btn btn-primary">
              Make a Reservation
            </router-link>
          </div>
        </div>
      </div>
      
      <div v-else-if="error" class="error-container">
        <h2>Error Loading Profile</h2>
        <p class="error-message">{{ error }}</p>
        <button class="btn btn-primary" @click="fetchUser">
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AuthService from '@/frontend/services/auth.service';
import { User } from '@/frontend/types/models';

// User data
const user = ref<User | null>(null);
const loading = ref(true);
const error = ref('');

// Edit mode
const editMode = ref(false);
const updating = ref(false);
const formError = ref('');
const form = ref({
  name: '',
  email: '',
  phone: ''
});

// Password form
const changingPassword = ref(false);
const passwordError = ref('');
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Fetch user data
const fetchUser = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    user.value = await AuthService.getUser();
    
    if (user.value) {
      resetForm();
    } else {
      error.value = 'Unable to retrieve user data';
    }
  } catch (err: any) {
    console.error('Error fetching user:', err);
    error.value = err.message || 'An error occurred while loading your profile';
  } finally {
    loading.value = false;
  }
};

// Computed properties
const userInitials = computed(() => {
  if (!user.value?.name) return '';
  
  return user.value.name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
});

const userRole = computed(() => {
  if (!user.value?.role) return 'User';
  
  switch (user.value.role) {
    case 'admin':
      return 'Administrator';
    case 'staff':
      return 'Staff Member';
    default:
      return 'User';
  }
});

// Form methods
const resetForm = () => {
  if (user.value) {
    form.value = {
      name: user.value.name,
      email: user.value.email,
      phone: user.value.phone || ''
    };
  }
};

const startEdit = () => {
  resetForm();
  editMode.value = true;
};

const cancelEdit = () => {
  formError.value = '';
  editMode.value = false;
};

const updateProfile = async () => {
  try {
    updating.value = true;
    formError.value = '';
    
    // Basic validation
    if (!form.value.name.trim()) {
      formError.value = 'Name is required';
      return;
    }
    
    if (!form.value.email.trim()) {
      formError.value = 'Email is required';
      return;
    }
    
    // Update profile
    user.value = await AuthService.updateProfile({
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone || undefined
    });
    
    // Exit edit mode
    editMode.value = false;
  } catch (err: any) {
    console.error('Error updating profile:', err);
    formError.value = err.message || 'Failed to update profile';
  } finally {
    updating.value = false;
  }
};

const changePassword = async () => {
  try {
    changingPassword.value = true;
    passwordError.value = '';
    
    // Validate passwords match
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      passwordError.value = 'New passwords do not match';
      return;
    }
    
    // Validate password length
    if (passwordForm.value.newPassword.length < 8) {
      passwordError.value = 'Password must be at least 8 characters long';
      return;
    }
    
    // Change password
    await AuthService.changePassword(
      passwordForm.value.oldPassword,
      passwordForm.value.newPassword
    );
    
    // Clear form
    passwordForm.value.oldPassword = '';
    passwordForm.value.newPassword = '';
    passwordForm.value.confirmPassword = '';
    
    // Show success
    alert('Password changed successfully');
  } catch (err: any) {
    console.error('Error changing password:', err);
    passwordError.value = err.message || 'Failed to change password. Please check your current password.';
  } finally {
    changingPassword.value = false;
  }
};

// Fetch user data on component mount
onMounted(() => {
  fetchUser();
});
</script>

<style scoped>
.profile-page {
  padding: 4rem 0;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-left-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-section {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  margin-bottom: 2rem;
}

.profile-title {
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

.profile-card {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.profile-avatar {
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  background-color: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 600;
}

.profile-details {
  flex-grow: 1;
}

.profile-field {
  margin-bottom: 1rem;
}

.field-label {
  font-weight: 600;
  margin-right: 0.5rem;
  color: #666;
}

.field-value {
  color: var(--text-color);
}

.profile-view {
  margin-bottom: 2rem;
}

.profile-form {
  max-width: 500px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  margin: 1rem 0;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
}

.error-container {
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.password-change-section h2 {
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

.reservation-list {
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }
  
  .profile-avatar {
    margin-bottom: 1rem;
  }
}
</style>