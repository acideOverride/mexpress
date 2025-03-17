// Mock product data for development and testing
import { Product } from '@/api/types/product';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Gaming Laptop',
    description: 'High-performance gaming laptop with RGB keyboard and 240Hz display',
    price: 1299.99,
    sku: 'LAP-GAM-001',
    stock: 15,
    category: 'Laptops',
    imageUrl: '/images/gaming-laptop.jpg',
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-03-01T14:45:00Z'
  },
  {
    id: '2',
    name: 'Mechanical Keyboard',
    description: 'Tactile mechanical keyboard with RGB lighting and programmable macros',
    price: 129.99,
    sku: 'KB-MECH-002',
    stock: 45,
    category: 'Peripherals',
    imageUrl: '/images/mechanical-keyboard.jpg',
    createdAt: '2025-02-05T09:15:00Z',
    updatedAt: '2025-02-28T11:20:00Z'
  },
  {
    id: '3',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with long battery life and adjustable DPI',
    price: 49.99,
    sku: 'MS-WIRE-003',
    stock: 78,
    category: 'Peripherals',
    imageUrl: '/images/wireless-mouse.jpg',
    createdAt: '2025-01-25T13:10:00Z',
    updatedAt: '2025-03-05T16:30:00Z'
  },
  {
    id: '4',
    name: '4K Monitor',
    description: '32-inch 4K UHD monitor with HDR support and slim bezels',
    price: 349.99,
    sku: 'MN-4K-004',
    stock: 12,
    category: 'Monitors',
    imageUrl: '/images/4k-monitor.jpg',
    createdAt: '2025-02-18T08:30:00Z',
    updatedAt: '2025-03-02T10:15:00Z'
  },
  {
    id: '5',
    name: 'External SSD',
    description: '1TB external SSD with USB-C connectivity and hardware encryption',
    price: 159.99,
    sku: 'SSD-EXT-005',
    stock: 30,
    category: 'Storage',
    imageUrl: '/images/external-ssd.jpg',
    createdAt: '2025-01-10T14:20:00Z',
    updatedAt: '2025-02-25T09:40:00Z'
  },
  {
    id: '6',
    name: 'Wireless Headphones',
    description: 'Over-ear noise cancelling headphones with 30-hour battery life',
    price: 199.99,
    sku: 'AUD-HEAD-006',
    stock: 25,
    category: 'Audio',
    imageUrl: '/images/wireless-headphones.jpg',
    createdAt: '2025-02-01T11:05:00Z',
    updatedAt: '2025-03-04T15:50:00Z'
  },
  {
    id: '7',
    name: 'Graphics Card',
    description: 'High-end graphics card with 12GB VRAM and ray tracing support',
    price: 699.99,
    sku: 'GPU-RTX-007',
    stock: 8,
    category: 'Components',
    imageUrl: '/images/graphics-card.jpg',
    createdAt: '2025-01-20T16:15:00Z',
    updatedAt: '2025-02-10T13:30:00Z'
  },
  {
    id: '8',
    name: 'Router',
    description: 'Dual-band WiFi 6 router with mesh capability and parental controls',
    price: 129.99,
    sku: 'NET-RTR-008',
    stock: 22,
    category: 'Networking',
    imageUrl: '/images/router.jpg',
    createdAt: '2025-02-12T10:40:00Z',
    updatedAt: '2025-03-08T09:20:00Z'
  },
  {
    id: '9',
    name: 'Webcam',
    description: '4K webcam with auto-focus and built-in microphone array',
    price: 89.99,
    sku: 'CAM-WEB-009',
    stock: 36,
    category: 'Peripherals',
    imageUrl: '/images/webcam.jpg',
    createdAt: '2025-01-30T13:25:00Z',
    updatedAt: '2025-02-22T16:45:00Z'
  },
  {
    id: '10',
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof Bluetooth speaker with 360° sound',
    price: 79.99,
    sku: 'AUD-SPK-010',
    stock: 40,
    category: 'Audio',
    imageUrl: '/images/bluetooth-speaker.jpg',
    createdAt: '2025-02-15T15:10:00Z',
    updatedAt: '2025-03-07T11:35:00Z'
  }
];

export const productCategories = [
  { value: 'all', text: 'All Categories' },
  { value: 'Laptops', text: 'Laptops' },
  { value: 'Peripherals', text: 'Peripherals' },
  { value: 'Monitors', text: 'Monitors' },
  { value: 'Storage', text: 'Storage' },
  { value: 'Audio', text: 'Audio' },
  { value: 'Components', text: 'Components' },
  { value: 'Networking', text: 'Networking' }
];

export const stockStatus = [
  { value: 'all', text: 'All Stock Levels' },
  { value: 'in-stock', text: 'In Stock (> 0)' },
  { value: 'low-stock', text: 'Low Stock (≤ 10)' },
  { value: 'out-of-stock', text: 'Out of Stock (0)' }
];

export function fetchMockProducts() {
  // Simulate API call delay
  return new Promise<{ data: Product[] }>(resolve => {
    setTimeout(() => {
      resolve({ data: mockProducts });
    }, 500);
  });
}

export function searchProducts(searchTerm: string) {
  // Simulate API call delay
  return new Promise<{ data: Product[] }>(resolve => {
    setTimeout(() => {
      const filteredProducts = mockProducts.filter(product => {
        const searchString = searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchString) ||
          product.description.toLowerCase().includes(searchString) ||
          product.sku.toLowerCase().includes(searchString) ||
          product.category?.toLowerCase().includes(searchString)
        );
      });
      resolve({ data: filteredProducts });
    }, 300);
  });
}

export function getProductById(id: string) {
  // Simulate API call delay
  return new Promise<{ data: Product | null }>(resolve => {
    setTimeout(() => {
      const product = mockProducts.find(p => p.id === id) || null;
      resolve({ data: product });
    }, 200);
  });
}

export function filterProductsByCategory(category: string) {
  if (category === 'all') {
    return mockProducts;
  }
  return mockProducts.filter(product => product.category === category);
}

export function filterProductsByStock(stockFilter: string) {
  switch (stockFilter) {
    case 'in-stock':
      return mockProducts.filter(product => product.stock > 0);
    case 'low-stock':
      return mockProducts.filter(product => product.stock > 0 && product.stock <= 10);
    case 'out-of-stock':
      return mockProducts.filter(product => product.stock === 0);
    default:
      return mockProducts;
  }
}

export function updateProduct(id: string, updates: Partial<Product>) {
  // Simulate API call delay
  return new Promise<{ data: Product }>(resolve => {
    setTimeout(() => {
      const productIndex = mockProducts.findIndex(p => p.id === id);
      if (productIndex === -1) {
        throw new Error(`Product with ID ${id} not found`);
      }
      
      // Create updated product with current date
      const updatedProduct = {
        ...mockProducts[productIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      // Update the product in the mock data array (for this session only)
      mockProducts[productIndex] = updatedProduct;
      
      resolve({ data: updatedProduct });
    }, 500);
  });
}

export function getRelatedProducts(category: string, currentProductId: string) {
  // Simulate API call delay
  return new Promise<{ data: Product[] }>(resolve => {
    setTimeout(() => {
      const relatedProducts = mockProducts.filter(product => 
        product.category === category && product.id !== currentProductId
      );
      resolve({ data: relatedProducts });
    }, 300);
  });
}

export default {
  mockProducts,
  productCategories,
  stockStatus,
  fetchMockProducts,
  searchProducts,
  getProductById,
  updateProduct,
  getRelatedProducts,
  filterProductsByCategory,
  filterProductsByStock
};