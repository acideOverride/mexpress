// Service instances
const { services } = require('../services');
const customerService = services.getCustomerService();
const productService = services.getProductService();

// UI State
let currentSection = 'customers';

// Navigation
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
    currentSection = sectionId;
    refreshList();
}

function showForm(formId) {
    document.getElementById(formId).classList.remove('hidden');
}

// Customer Management
async function handleCustomerSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const customer = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
    };

    try {
        await customerService.create(customer);
        event.target.reset();
        document.getElementById('customer-form').classList.add('hidden');
        refreshList();
    } catch (error) {
        alert(`Error creating customer: ${error.message}`);
    }
}

async function deleteCustomer(id) {
    if (confirm('Are you sure you want to delete this customer?')) {
        try {
            await customerService.delete(id);
            refreshList();
        } catch (error) {
            alert(`Error deleting customer: ${error.message}`);
        }
    }
}

// Product Management
async function handleProductSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const product = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: Number(formData.get('price')),
        sku: formData.get('sku'),
        stock: Number(formData.get('stock')),
        category: formData.get('category'),
    };

    try {
        await productService.create(product);
        event.target.reset();
        document.getElementById('product-form').classList.add('hidden');
        refreshList();
    } catch (error) {
        alert(`Error creating product: ${error.message}`);
    }
}

async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await productService.delete(id);
            refreshList();
        } catch (error) {
            alert(`Error deleting product: ${error.message}`);
        }
    }
}

// List Management
async function refreshList() {
    const listContainer = document.getElementById(`${currentSection}-list`);
    listContainer.innerHTML = '';

    try {
        const service = currentSection === 'customers' ? customerService : productService;
        const response = await service.list();

        response.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'list-item';
            
            const content = document.createElement('div');
            content.className = 'list-item-content';
            
            if (currentSection === 'customers') {
                content.innerHTML = `
                    <h3>${item.name}</h3>
                    <p>Email: ${item.email}</p>
                    ${item.phone ? `<p>Phone: ${item.phone}</p>` : ''}
                `;
            } else {
                content.innerHTML = `
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p>Price: $${item.price.toFixed(2)} | Stock: ${item.stock}</p>
                    <p>SKU: ${item.sku}</p>
                `;
            }

            const actions = document.createElement('div');
            actions.className = 'list-item-actions';
            actions.innerHTML = `
                <button onclick="delete${currentSection === 'customers' ? 'Customer' : 'Product'}('${item.id}')" class="delete-button">
                    Delete
                </button>
            `;

            itemElement.appendChild(content);
            itemElement.appendChild(actions);
            listContainer.appendChild(itemElement);
        });
    } catch (error) {
        listContainer.innerHTML = `<p>Error loading ${currentSection}: ${error.message}</p>`;
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    showSection('customers');
});