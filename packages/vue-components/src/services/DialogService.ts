/**
 * Dialog Service
 * 
 * Provides programmatic methods to show different types of dialogs
 * without having to manually include the Dialog component in templates.
 */

import { createApp, h, ref, reactive } from 'vue';
import Dialog from '../components/ui/Dialog.vue';

// Types
type AlertOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  scrollable?: boolean;
  transition?: string;
};

type ConfirmOptions = AlertOptions & {
  cancelText?: string;
};

type PromptOptions = ConfirmOptions & {
  defaultValue?: string;
  inputType?: string;
  inputPlaceholder?: string;
  inputValidator?: (value: string) => boolean | string;
};

// Dialog service class
class DialogService {
  private mountPoint: HTMLElement | null = null;

  constructor() {
    // Create a mount point for the dialog
    this.createMountPoint();
  }

  private createMountPoint() {
    // Check if mount point already exists
    if (document.getElementById('dialog-service-mount')) {
      this.mountPoint = document.getElementById('dialog-service-mount');
      return;
    }

    // Create a new mount point
    this.mountPoint = document.createElement('div');
    this.mountPoint.id = 'dialog-service-mount';
    document.body.appendChild(this.mountPoint);
  }

  /**
   * Show a simple alert dialog
   * @param options Alert options
   * @returns Promise that resolves when the dialog is closed
   */
  alert(options: AlertOptions | string): Promise<boolean> {
    // Handle string shorthand
    if (typeof options === 'string') {
      options = { message: options };
    }

    return new Promise((resolve) => {
      const isOpen = ref(true);
      
      // Create the app
      const app = createApp({
        setup() {
          const handleConfirm = (result: boolean) => {
            isOpen.value = false;
            setTimeout(() => {
              app.unmount();
              if (mountEl.parentNode) {
                mountEl.parentNode.removeChild(mountEl);
              }
              resolve(result);
            }, 300); // Allow time for close animation
          };

          return () => h(Dialog, {
            modelValue: isOpen.value,
            'onUpdate:modelValue': (val: boolean) => { isOpen.value = val; },
            title: options.title || 'Alert',
            message: options.message,
            type: 'alert',
            confirmText: options.confirmText || 'OK',
            size: options.size || 'sm',
            centered: options.centered !== undefined ? options.centered : true,
            scrollable: options.scrollable || false,
            transition: options.transition || 'modal-scale',
            onConfirm: handleConfirm,
            onClose: () => handleConfirm(false)
          });
        }
      });

      // Create a new mount element (needed to avoid conflicts with multiple dialogs)
      const mountEl = document.createElement('div');
      this.mountPoint?.appendChild(mountEl);
      
      // Mount the app
      app.mount(mountEl);
    });
  }

  /**
   * Show a confirmation dialog with Cancel and Confirm buttons
   * @param options Confirm options
   * @returns Promise that resolves to true if confirmed, false if canceled
   */
  confirm(options: ConfirmOptions | string): Promise<boolean> {
    // Handle string shorthand
    if (typeof options === 'string') {
      options = { message: options };
    }

    return new Promise((resolve) => {
      const isOpen = ref(true);
      
      // Create the app
      const app = createApp({
        setup() {
          const handleConfirm = (result: boolean) => {
            isOpen.value = false;
            setTimeout(() => {
              app.unmount();
              if (mountEl.parentNode) {
                mountEl.parentNode.removeChild(mountEl);
              }
              resolve(result);
            }, 300); // Allow time for close animation
          };

          return () => h(Dialog, {
            modelValue: isOpen.value,
            'onUpdate:modelValue': (val: boolean) => { isOpen.value = val; },
            title: options.title || 'Confirm',
            message: options.message,
            type: 'confirm',
            confirmText: options.confirmText || 'Confirm',
            cancelText: options.cancelText || 'Cancel',
            size: options.size || 'sm',
            centered: options.centered !== undefined ? options.centered : true,
            scrollable: options.scrollable || false,
            transition: options.transition || 'modal-scale',
            onConfirm: handleConfirm,
            onClose: () => handleConfirm(false)
          });
        }
      });

      // Create a new mount element
      const mountEl = document.createElement('div');
      this.mountPoint?.appendChild(mountEl);
      
      // Mount the app
      app.mount(mountEl);
    });
  }

  /**
   * Show a prompt dialog with input field
   * @param options Prompt options
   * @returns Promise that resolves to the input value, or null if canceled
   */
  prompt(options: PromptOptions | string): Promise<string | null> {
    // Handle string shorthand
    if (typeof options === 'string') {
      options = { message: options };
    }

    return new Promise((resolve) => {
      const isOpen = ref(true);
      
      // Create the app
      const app = createApp({
        setup() {
          const handleConfirm = (result: string | null) => {
            isOpen.value = false;
            setTimeout(() => {
              app.unmount();
              if (mountEl.parentNode) {
                mountEl.parentNode.removeChild(mountEl);
              }
              resolve(result);
            }, 300); // Allow time for close animation
          };

          return () => h(Dialog, {
            modelValue: isOpen.value,
            'onUpdate:modelValue': (val: boolean) => { isOpen.value = val; },
            title: options.title || 'Prompt',
            message: options.message,
            type: 'prompt',
            confirmText: options.confirmText || 'OK',
            cancelText: options.cancelText || 'Cancel',
            defaultValue: options.defaultValue || '',
            inputType: options.inputType || 'text',
            inputPlaceholder: options.inputPlaceholder || '',
            inputValidator: options.inputValidator,
            size: options.size || 'sm',
            centered: options.centered !== undefined ? options.centered : true,
            scrollable: options.scrollable || false,
            transition: options.transition || 'modal-scale',
            onConfirm: handleConfirm,
            onClose: () => handleConfirm(null)
          });
        }
      });

      // Create a new mount element
      const mountEl = document.createElement('div');
      this.mountPoint?.appendChild(mountEl);
      
      // Mount the app
      app.mount(mountEl);
    });
  }
}

// Export a singleton instance
export const dialogService = new DialogService();

// Vue plugin
export const DialogPlugin = {
  install(app: any) {
    app.config.globalProperties.$dialog = dialogService;
  }
};

// Export a composable for use in the Composition API
export function useDialog() {
  return dialogService;
}