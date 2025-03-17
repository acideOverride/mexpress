/**
 * Customer Detail Modal Handler
 * This script handles the customer detail modal functionality
 */

// Main class to handle the modal functionality
class CustomerDetailModal {
  constructor() {
    this.modalContainerId = 'customerDetailModal';
    this.modalContainer = null;
    this.isModalOpen = false;
    this.currentCustomerId = null;
    
    // Initialize event listeners
    this.initEventListeners();
  }
  
  // Set up event listeners for view buttons
  initEventListeners() {
    // Find all view customer buttons (eye icons)
    const viewButtons = document.querySelectorAll('.action-button[title="View Customer"]');
    
    // Add click event to each button
    viewButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        
        // Get the customer data from the row
        const row = button.closest('tr');
        const customerId = row.cells[0].textContent;
        const customerName = row.cells[1].textContent;
        const customerEmail = row.cells[2].textContent;
        const customerPhone = row.cells[3].textContent;
        const customerStatus = row.cells[4].querySelector('.status-badge').textContent;
        
        // Open the modal with this customer's data
        this.openModal(customerId, customerName, customerEmail, customerPhone, customerStatus);
      });
    });
  }
  
  // Load the modal HTML content
  async loadModalContent() {
    try {
      const response = await fetch('customer-detail-modal.html');
      const html = await response.text();
      
      // Create modal container if it doesn't exist
      if (!this.modalContainer) {
        this.modalContainer = document.createElement('div');
        this.modalContainer.id = this.modalContainerId;
        document.body.appendChild(this.modalContainer);
      }
      
      // Insert the HTML
      this.modalContainer.innerHTML = html;
      
      // Setup close button event
      const closeButton = this.modalContainer.querySelector('#closeModal');
      if (closeButton) {
        closeButton.addEventListener('click', () => this.closeModal());
      }
      
      // Setup click outside to close
      this.modalContainer.querySelector('.modal-overlay').addEventListener('click', (event) => {
        if (event.target.classList.contains('modal-overlay')) {
          this.closeModal();
        }
      });
      
      // Escape key to close
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && this.isModalOpen) {
          this.closeModal();
        }
      });
      
      return true;
    } catch (error) {
      console.error('Failed to load modal content:', error);
      return false;
    }
  }
  
  // Open the modal with customer data
  async openModal(customerId, name, email, phone, status) {
    // Load the modal content if not already loaded
    if (!this.modalContainer) {
      const loaded = await this.loadModalContent();
      if (!loaded) return;
    }
    
    // Ensure modal HTML is in the DOM
    if (!document.getElementById(this.modalContainerId)) {
      document.body.appendChild(this.modalContainer);
    }
    
    // Show the modal
    this.modalContainer.style.display = 'block';
    this.isModalOpen = true;
    this.currentCustomerId = customerId;
    
    // Apply current theme to modal
    this.applyTheme();
    
    // Update customer data in the modal
    this.updateCustomerData(customerId, name, email, phone, status);
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    
    // Add animation class
    setTimeout(() => {
      const modalElement = this.modalContainer.querySelector('.modal-container');
      if (modalElement) modalElement.classList.add('modal-open');
    }, 10);
  }
  
  // Close the modal
  closeModal() {
    if (!this.isModalOpen) return;
    
    // Start close animation
    const modalElement = this.modalContainer.querySelector('.modal-container');
    if (modalElement) modalElement.classList.remove('modal-open');
    
    // Hide after animation
    setTimeout(() => {
      this.modalContainer.style.display = 'none';
      this.isModalOpen = false;
      this.currentCustomerId = null;
      
      // Re-enable background scrolling
      document.body.style.overflow = '';
    }, 300);
  }
  
  // Update modal content with customer data
  updateCustomerData(customerId, name, email, phone, status) {
    // Find elements to update
    const customerIdElement = this.modalContainer.querySelector('.customer-id');
    const customerNameElement = this.modalContainer.querySelector('.info-value');
    const customerStatusElement = this.modalContainer.querySelector('.status-badge');
    const customerEmailElement = this.modalContainer.querySelectorAll('.info-value')[2];
    const customerPhoneElement = this.modalContainer.querySelectorAll('.info-value')[3];
    
    // Update content
    if (customerIdElement) customerIdElement.textContent = customerId;
    if (customerNameElement) customerNameElement.textContent = name;
    if (customerEmailElement) customerEmailElement.textContent = email;
    if (customerPhoneElement) customerPhoneElement.textContent = phone;
    
    // Update status badge
    if (customerStatusElement) {
      // Remove all status classes
      customerStatusElement.classList.remove('status-active', 'status-inactive', 'status-pending', 'status-priority');
      
      // Add appropriate class based on status
      if (status.trim() === 'Active') {
        customerStatusElement.classList.add('status-active');
        customerStatusElement.textContent = 'Active';
      } else if (status.trim() === 'Inactive') {
        customerStatusElement.classList.add('status-inactive');
        customerStatusElement.textContent = 'Inactive';
      } else if (status.trim() === 'Pending') {
        customerStatusElement.classList.add('status-pending');
        customerStatusElement.textContent = 'Pending';
      } else if (status.trim() === 'Priority') {
        customerStatusElement.classList.add('status-priority');
        customerStatusElement.textContent = 'Priority';
      }
    }
    
    // In a real implementation, we would fetch additional customer data here
    // and update other parts of the modal
  }
  
  // Apply the current theme to the modal
  applyTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const modalBody = this.modalContainer.querySelector('body');
    if (modalBody) {
      modalBody.setAttribute('data-theme', currentTheme || 'light');
    }
  }
}

// Initialize the modal handler when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.customerDetailModal = new CustomerDetailModal();
  
  // For demonstration purposes, we'll automatically load the modal content
  window.customerDetailModal.loadModalContent();
});