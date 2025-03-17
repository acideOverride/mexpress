// Search service for MegaSearch component

import { Customer } from '@/api/types/customer';
import { Product } from '@/api/types/product';
import { Ticket } from '@/api/types/ticket';
import { mockCustomers } from './mockData';
import { mockProducts } from './productMockData';

// Define search result types
export interface SearchResultBase {
  id: string;
  type: string;
  url: string;
}

export interface CustomerSearchResult extends SearchResultBase {
  type: 'customer';
  name: string;
  email?: string;
  phone?: string;
}

export interface ProductSearchResult extends SearchResultBase {
  type: 'product';
  name: string;
  sku: string;
  price: number;
}

export interface TicketSearchResult extends SearchResultBase {
  type: 'ticket';
  title: string;
  status: string;
  customer: string;
}

export interface SearchResults {
  customers: CustomerSearchResult[];
  products: ProductSearchResult[];
  tickets: TicketSearchResult[];
}

// Mock tickets for search results
const mockTickets: Ticket[] = [
  {
    id: 't1',
    title: 'Laptop screen repair',
    description: 'Customer reports cracked screen on gaming laptop',
    status: 'In Progress',
    priority: 'Medium',
    customerId: 'c1',
    customerName: 'John Smith',
    assignedTo: 'tech1',
    createdAt: '2025-03-01T10:30:00Z',
    updatedAt: '2025-03-05T14:45:00Z'
  },
  {
    id: 't2',
    title: 'PC not booting',
    description: 'Customer reports desktop PC won\'t turn on',
    status: 'Open',
    priority: 'High',
    customerId: 'c2',
    customerName: 'Jane Doe',
    assignedTo: 'tech2',
    createdAt: '2025-03-10T09:15:00Z',
    updatedAt: '2025-03-10T09:15:00Z'
  },
  {
    id: 't3',
    title: 'Software installation',
    description: 'Install Adobe Creative Suite on new laptop',
    status: 'Completed',
    priority: 'Low',
    customerId: 'c3',
    customerName: 'Bob Johnson',
    assignedTo: 'tech1',
    createdAt: '2025-02-28T11:20:00Z',
    updatedAt: '2025-03-02T15:30:00Z'
  }
];

// Convert entities to search results
const customerToSearchResult = (customer: Customer): CustomerSearchResult => ({
  id: customer.id,
  type: 'customer',
  name: `${customer.firstName} ${customer.lastName}`,
  email: customer.email,
  phone: customer.phone,
  url: `/customers/${customer.id}`
});

const productToSearchResult = (product: Product): ProductSearchResult => ({
  id: product.id,
  type: 'product',
  name: product.name,
  sku: product.sku,
  price: product.price,
  url: `/products/${product.id}`
});

const ticketToSearchResult = (ticket: Ticket): TicketSearchResult => ({
  id: ticket.id,
  type: 'ticket',
  title: ticket.title,
  status: ticket.status,
  customer: ticket.customerName,
  url: `/tickets/${ticket.id}`
});

// Helper function to match search term
const matchesSearch = (text: string | undefined, term: string): boolean => {
  if (!text) return false;
  return text.toLowerCase().includes(term.toLowerCase());
};

// Local storage key for recent searches
const RECENT_SEARCHES_KEY = 'montpc-recent-searches';

// SearchService implementation
export const searchService = {
  /**
   * Search across customers, products, and tickets
   * @param term Search term to query
   * @param limit Maximum number of results per category
   * @returns Promise with search results
   */
  search: async (term: string, limit: number = 5): Promise<{ data: SearchResults }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!term.trim()) {
      return {
        data: {
          customers: [],
          products: [],
          tickets: []
        }
      };
    }

    // Save to recent searches
    searchService.saveRecentSearch(term);

    // Filter customers
    const customers = mockCustomers
      .filter(customer => 
        matchesSearch(`${customer.firstName} ${customer.lastName}`, term) ||
        matchesSearch(customer.email, term) ||
        matchesSearch(customer.phone, term)
      )
      .slice(0, limit)
      .map(customerToSearchResult);
    
    // Filter products
    const products = mockProducts
      .filter(product => 
        matchesSearch(product.name, term) ||
        matchesSearch(product.sku, term) ||
        matchesSearch(product.description, term) ||
        matchesSearch(product.category, term)
      )
      .slice(0, limit)
      .map(productToSearchResult);
    
    // Filter tickets
    const tickets = mockTickets
      .filter(ticket => 
        matchesSearch(ticket.title, term) ||
        matchesSearch(ticket.description, term) ||
        matchesSearch(ticket.customerName, term) ||
        matchesSearch(ticket.status, term)
      )
      .slice(0, limit)
      .map(ticketToSearchResult);
    
    return {
      data: {
        customers,
        products,
        tickets
      }
    };
  },

  /**
   * Get recent searches from local storage
   * @param limit Maximum number of recent searches to return
   * @returns Promise with recent searches
   */
  getRecentSearches: async (limit: number = 5): Promise<{ data: string[] }> => {
    try {
      const recentSearches = JSON.parse(
        localStorage.getItem(RECENT_SEARCHES_KEY) || '[]'
      ) as string[];
      
      return {
        data: recentSearches.slice(0, limit)
      };
    } catch (error) {
      console.error('Error retrieving recent searches:', error);
      return { data: [] };
    }
  },

  /**
   * Save search term to recent searches
   * @param term Search term to save
   */
  saveRecentSearch: (term: string): void => {
    if (!term.trim()) return;
    
    try {
      const recentSearches = JSON.parse(
        localStorage.getItem(RECENT_SEARCHES_KEY) || '[]'
      ) as string[];
      
      // Add to beginning if not already present, otherwise move to beginning
      const updatedSearches = [
        term,
        ...recentSearches.filter(s => s !== term)
      ].slice(0, 10); // Keep only the 10 most recent
      
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  },

  /**
   * Clear all recent searches
   */
  clearRecentSearches: (): void => {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  }
};

export default searchService;