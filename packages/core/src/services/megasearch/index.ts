// MegaSearch service exports
export * from './megasearch.types';
export * from './megasearch.service';
export * from './adapters/customer-search.adapter';
export * from './adapters/product-search.adapter';
export * from './adapters/user-search.adapter';

// Factory function to create and configure a MegaSearch service
import { MegaSearchService } from './megasearch.service';
import { CustomerSearchAdapter } from './adapters/customer-search.adapter';
import { ProductSearchAdapter } from './adapters/product-search.adapter';
import { UserSearchAdapter } from './adapters/user-search.adapter';
import { CustomerService } from '../customer.service';
import { ProductService } from '../product.service';

/**
 * Create a fully configured MegaSearch service with all adapters registered
 * @returns Configured MegaSearchService instance
 */
export function createMegaSearchService(): MegaSearchService {
  const megaSearch = new MegaSearchService();
  
  // Create and register adapters
  const customerService = new CustomerService();
  const productService = new ProductService();
  
  const customerAdapter = new CustomerSearchAdapter(customerService);
  const productAdapter = new ProductSearchAdapter(productService);
  const userAdapter = new UserSearchAdapter();
  
  megaSearch.registerAdapter(customerAdapter);
  megaSearch.registerAdapter(productAdapter);
  megaSearch.registerAdapter(userAdapter);
  
  return megaSearch;
}