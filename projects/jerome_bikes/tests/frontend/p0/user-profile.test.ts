/**
 * User Profile Tests
 * 
 * These tests verify the user profile functionality, including displaying user
 * data, updating profile information, and changing password.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import AuthService from '@/frontend/services/auth.service';
import { routes } from '@/frontend/router';

// We will create this component later
const ProfileComponent = {
  template: `
    <div class="profile-page">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="user" class="profile-details">
        <h1>My Profile</h1>
        <div v-if="editMode">
          <form @submit.prevent="updateProfile">
            <div class="form-group">
              <label for="name">Name</label>
              <input id="name" v-model="form.name" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" v-model="form.email" type="email" required />
            </div>
            <div class="form-group">
              <label for="phone">Phone (optional)</label>
              <input id="phone" v-model="form.phone" type="tel" />
            </div>
            <div class="form-actions">
              <button type="submit">Save Changes</button>
              <button type="button" @click="cancelEdit">Cancel</button>
            </div>
          </form>
        </div>
        <div v-else class="profile-view">
          <div class="profile-field">
            <span class="field-label">Name:</span>
            <span class="field-value">{{ user.name }}</span>
          </div>
          <div class="profile-field">
            <span class="field-label">Email:</span>
            <span class="field-value">{{ user.email }}</span>
          </div>
          <div class="profile-field" v-if="user.phone">
            <span class="field-label">Phone:</span>
            <span class="field-value">{{ user.phone }}</span>
          </div>
          <button @click="startEdit">Edit Profile</button>
        </div>
        
        <div class="password-change-section">
          <h2>Change Password</h2>
          <form @submit.prevent="changePassword">
            <div class="form-group">
              <label for="current-password">Current Password</label>
              <input 
                id="current-password" 
                v-model="passwordForm.oldPassword" 
                type="password" 
                required 
              />
            </div>
            <div class="form-group">
              <label for="new-password">New Password</label>
              <input 
                id="new-password" 
                v-model="passwordForm.newPassword" 
                type="password" 
                required 
                minlength="8"
              />
            </div>
            <div class="form-group">
              <label for="confirm-password">Confirm New Password</label>
              <input 
                id="confirm-password" 
                v-model="passwordForm.confirmPassword" 
                type="password" 
                required 
              />
            </div>
            <div v-if="passwordError" class="error-message">
              {{ passwordError }}
            </div>
            <button type="submit">Change Password</button>
          </form>
        </div>
      </div>
      <div v-else class="error-message">
        {{ error }}
      </div>
    </div>
  `,
  data() {
    return {
      user: null,
      loading: true,
      error: '',
      editMode: false,
      form: {
        name: '',
        email: '',
        phone: ''
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordError: ''
    };
  },
  async mounted() {
    try {
      this.loading = true;
      this.user = await AuthService.getUser();
      this.resetForm();
    } catch (err) {
      this.error = 'Failed to load user data';
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    resetForm() {
      if (this.user) {
        this.form.name = this.user.name;
        this.form.email = this.user.email;
        this.form.phone = this.user.phone || '';
      }
    },
    startEdit() {
      this.editMode = true;
      this.resetForm();
    },
    cancelEdit() {
      this.editMode = false;
    },
    async updateProfile() {
      try {
        this.loading = true;
        this.user = await AuthService.updateProfile(this.form);
        this.editMode = false;
      } catch (err) {
        this.error = 'Failed to update profile';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async changePassword() {
      try {
        // Reset error
        this.passwordError = '';
        
        // Validate passwords match
        if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
          this.passwordError = 'New passwords do not match';
          return;
        }
        
        // Validate password length
        if (this.passwordForm.newPassword.length < 8) {
          this.passwordError = 'Password must be at least 8 characters long';
          return;
        }
        
        await AuthService.changePassword(
          this.passwordForm.oldPassword,
          this.passwordForm.newPassword
        );
        
        // Clear form
        this.passwordForm.oldPassword = '';
        this.passwordForm.newPassword = '';
        this.passwordForm.confirmPassword = '';
        
        // Show success
        alert('Password changed successfully');
      } catch (err) {
        this.passwordError = 'Failed to change password. Please check your current password.';
        console.error(err);
      }
    }
  }
};

// Mock AuthService
vi.mock('@/frontend/services/auth.service', () => ({
  default: {
    getUser: vi.fn(),
    updateProfile: vi.fn(),
    changePassword: vi.fn(),
    isAuthenticated: vi.fn()
  }
}));

// Setup router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...routes,
    {
      path: '/profile',
      name: 'Profile',
      component: ProfileComponent,
      meta: { requiresAuth: true }
    }
  ]
});

describe('User Profile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Profile Display', () => {
    it('should show loading state initially', async () => {
      // Mock getUser to be slow
      const getUserPromise = new Promise((resolve) => setTimeout(resolve, 100));
      (AuthService.getUser as any).mockReturnValue(getUserPromise);
      
      const wrapper = mount(ProfileComponent, {
        global: {
          plugins: [router]
        }
      });
      
      // Should show loading
      expect(wrapper.find('.loading').exists()).toBe(true);
      
      // Wait for getUser to resolve
      await flushPromises();
    });
    
    it('should display user data when loaded', async () => {
      // Mock user data
      const mockUser = { 
        id: '1', 
        name: 'Test User', 
        email: 'test@example.com',
        phone: '+1234567890',
        role: 'user'
      };
      (AuthService.getUser as any).mockResolvedValue(mockUser);
      
      const wrapper = mount(ProfileComponent, {
        global: {
          plugins: [router]
        }
      });
      
      // Wait for component to load data
      await flushPromises();
      
      // Should display user data
      expect(wrapper.find('.loading').exists()).toBe(false);
      expect(wrapper.find('.profile-view').exists()).toBe(true);
      expect(wrapper.find('.field-value').at(0).text()).toBe(mockUser.name);
      expect(wrapper.find('.field-value').at(1).text()).toBe(mockUser.email);
      expect(wrapper.find('.field-value').at(2).text()).toBe(mockUser.phone);
    });
    
    it('should show error message if loading fails', async () => {
      // Mock error
      (AuthService.getUser as any).mockRejectedValue(new Error('Failed to fetch'));
      
      const wrapper = mount(ProfileComponent, {
        global: {
          plugins: [router]
        }
      });
      
      // Wait for component to attempt loading
      await flushPromises();
      
      // Should show error
      expect(wrapper.find('.loading').exists()).toBe(false);
      expect(wrapper.find('.error-message').exists()).toBe(true);
      expect(wrapper.find('.error-message').text()).toContain('Failed to load');
    });
  });
  
  describe('Profile Editing', () => {
    it('should switch to edit mode when edit button is clicked', async () => {
      // Mock user data
      const mockUser = { 
        id: '1', 
        name: 'Test User', 
        email: 'test@example.com',
        role: 'user'
      };
      (AuthService.getUser as any).mockResolvedValue(mockUser);
      
      const wrapper = mount(ProfileComponent, {
        global: {
          plugins: [router]
        }
      });
      
      // Wait for component to load data
      await flushPromises();
      
      // Initially in view mode
      expect(wrapper.find('.profile-view').exists()).toBe(true);
      expect(wrapper.find('form').exists()).toBe(false);
      
      // Click edit button
      await wrapper.find('button').trigger('click');
      
      // Should be in edit mode now
      expect(wrapper.find('.profile-view').exists()).toBe(false);
      expect(wrapper.find('form').exists()).toBe(true);
      
      // Form should have user data
      expect(wrapper.find('#name').element.value).toBe(mockUser.name);
      expect(wrapper.find('#email').element.value).toBe(mockUser.email);
    });
    
    it('should update profile when form is submitted', async () => {
      // Mock user data
      const mockUser = { 
        id: '1', 
        name: 'Test User', 
        email: 'test@example.com',
        role: 'user'
      };
      (AuthService.getUser as any).mockResolvedValue(mockUser);
      
      // Mock update
      const updatedUser = { 
        ...mockUser, 
        name: 'Updated Name', 
        email: 'updated@example.com',
        phone: '+9876543210'
      };
      (AuthService.updateProfile as any).mockResolvedValue(updatedUser);
      
      const wrapper = mount(ProfileComponent, {
        global: {
          plugins: [router]
        }
      });
      
      // Wait for component to load data
      await flushPromises();
      
      // Switch to edit mode
      await wrapper.find('button').trigger('click');
      
      // Update form values
      await wrapper.find('#name').setValue('Updated Name');
      await wrapper.find('#email').setValue('updated@example.com');
      await wrapper.find('#phone').setValue('+9876543210');
      
      // Submit form
      await wrapper.find('form').trigger('submit');
      
      // Wait for update to process
      await flushPromises();
      
      // Should have called updateProfile with correct data
      expect(AuthService.updateProfile).toHaveBeenCalledWith({
        name: 'Updated Name',
        email: 'updated@example.com',
        phone: '+9876543210'
      });
      
      // Should return to view mode with updated data
      expect(wrapper.find('.profile-view').exists()).toBe(true);
      expect(wrapper.find('.field-value').at(0).text()).toBe(updatedUser.name);
      expect(wrapper.find('.field-value').at(1).text()).toBe(updatedUser.email);
    });
    
    it('should cancel edit and revert changes', async () => {
      // Mock user data
      const mockUser = { 
        id: '1', 
        name: 'Test User', 
        email: 'test@example.com',
        role: 'user'
      };
      (AuthService.getUser as any).mockResolvedValue(mockUser);
      
      const wrapper = mount(ProfileComponent, {
        global: {
          plugins: [router]
        }
      });
      
      // Wait for component to load data
      await flushPromises();
      
      // Switch to edit mode
      await wrapper.find('button').trigger('click');
      
      // Update form values
      await wrapper.find('#name').setValue('Changed Name');
      await wrapper.find('#email').setValue('changed@example.com');
      
      // Click cancel button
      await wrapper.findAll('button').at(1).trigger('click');
      
      // Should be back in view mode with original data
      expect(wrapper.find('.profile-view').exists()).toBe(true);
      expect(wrapper.find('.field-value').at(0).text()).toBe(mockUser.name);
      expect(wrapper.find('.field-value').at(1).text()).toBe(mockUser.email);
      
      // Should not have called updateProfile
      expect(AuthService.updateProfile).not.toHaveBeenCalled();
    });
  });
  
  describe('Password Changing', () => {
    it('should validate passwords match', async () => {
      // Mock user data
      const mockUser = { 
        id: '1', 
        name: 'Test User', 
        email: 'test@example.com',
        role: 'user'
      };
      (AuthService.getUser as any).mockResolvedValue(mockUser);
      
      const wrapper = mount(ProfileComponent, {
        global: {
          plugins: [router]
        }
      });
      
      // Wait for component to load data
      await flushPromises();
      
      // Fill password form with mismatched passwords
      await wrapper.find('#current-password').setValue('oldpassword');
      await wrapper.find('#new-password').setValue('newpassword');
      await wrapper.find('#confirm-password').setValue('mismatchedpassword');
      
      // Submit form
      await wrapper.find('.password-change-section form').trigger('submit');
      
      // Should display error
      expect(wrapper.find('.password-change-section .error-message').exists()).toBe(true);
      expect(wrapper.find('.password-change-section .error-message').text()).toContain('do not match');
      
      // Should not have called changePassword
      expect(AuthService.changePassword).not.toHaveBeenCalled();
    });
    
    it('should validate password length', async () => {
      // Mock user data
      const mockUser = { 
        id: '1', 
        name: 'Test User', 
        email: 'test@example.com',
        role: 'user'
      };
      (AuthService.getUser as any).mockResolvedValue(mockUser);
      
      const wrapper = mount(ProfileComponent, {
        global: {
          plugins: [router]
        }
      });
      
      // Wait for component to load data
      await flushPromises();
      
      // Fill password form with short password
      await wrapper.find('#current-password').setValue('oldpassword');
      await wrapper.find('#new-password').setValue('short');
      await wrapper.find('#confirm-password').setValue('short');
      
      // Submit form
      await wrapper.find('.password-change-section form').trigger('submit');
      
      // Should display error
      expect(wrapper.find('.password-change-section .error-message').exists()).toBe(true);
      expect(wrapper.find('.password-change-section .error-message').text()).toContain('at least 8 characters');
      
      // Should not have called changePassword
      expect(AuthService.changePassword).not.toHaveBeenCalled();
    });
    
    it('should change password when form is valid', async () => {
      // Mock user data
      const mockUser = { 
        id: '1', 
        name: 'Test User', 
        email: 'test@example.com',
        role: 'user'
      };
      (AuthService.getUser as any).mockResolvedValue(mockUser);
      
      // Mock successful password change
      (AuthService.changePassword as any).mockResolvedValue(undefined);
      
      // Mock window.alert
      const alertMock = vi.fn();
      window.alert = alertMock;
      
      const wrapper = mount(ProfileComponent, {
        global: {
          plugins: [router]
        }
      });
      
      // Wait for component to load data
      await flushPromises();
      
      // Fill password form correctly
      await wrapper.find('#current-password').setValue('oldpassword');
      await wrapper.find('#new-password').setValue('newpassword12345');
      await wrapper.find('#confirm-password').setValue('newpassword12345');
      
      // Submit form
      await wrapper.find('.password-change-section form').trigger('submit');
      
      // Wait for processing
      await flushPromises();
      
      // Should have called changePassword with correct data
      expect(AuthService.changePassword).toHaveBeenCalledWith(
        'oldpassword',
        'newpassword12345'
      );
      
      // Should show success alert
      expect(alertMock).toHaveBeenCalledWith('Password changed successfully');
      
      // Form should be cleared
      expect(wrapper.find('#current-password').element.value).toBe('');
      expect(wrapper.find('#new-password').element.value).toBe('');
      expect(wrapper.find('#confirm-password').element.value).toBe('');
    });
    
    it('should show error on password change failure', async () => {
      // Mock user data
      const mockUser = { 
        id: '1', 
        name: 'Test User', 
        email: 'test@example.com',
        role: 'user'
      };
      (AuthService.getUser as any).mockResolvedValue(mockUser);
      
      // Mock failed password change
      (AuthService.changePassword as any).mockRejectedValue(
        new Error('Incorrect current password')
      );
      
      const wrapper = mount(ProfileComponent, {
        global: {
          plugins: [router]
        }
      });
      
      // Wait for component to load data
      await flushPromises();
      
      // Fill password form
      await wrapper.find('#current-password').setValue('wrongpassword');
      await wrapper.find('#new-password').setValue('newpassword12345');
      await wrapper.find('#confirm-password').setValue('newpassword12345');
      
      // Submit form
      await wrapper.find('.password-change-section form').trigger('submit');
      
      // Wait for processing
      await flushPromises();
      
      // Should display error
      expect(wrapper.find('.password-change-section .error-message').exists()).toBe(true);
      expect(wrapper.find('.password-change-section .error-message').text())
        .toContain('Failed to change password');
    });
  });
});