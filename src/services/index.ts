import { CustomerService } from './customer.service';
import { ProductService } from './product.service';

/**
 * Service registry for managing application services
 */
export class ServiceRegistry {
    private static instance: ServiceRegistry;
    private customerService: CustomerService;
    private productService: ProductService;

    private constructor() {
        this.customerService = new CustomerService();
        this.productService = new ProductService();
    }

    /**
     * Get the singleton instance of ServiceRegistry
     */
    public static getInstance(): ServiceRegistry {
        if (!ServiceRegistry.instance) {
            ServiceRegistry.instance = new ServiceRegistry();
        }
        return ServiceRegistry.instance;
    }

    /**
     * Get the customer service instance
     */
    public getCustomerService(): CustomerService {
        return this.customerService;
    }

    /**
     * Get the product service instance
     */
    public getProductService(): ProductService {
        return this.productService;
    }

    /**
     * Reset all services (mainly for testing)
     */
    public reset(): void {
        this.customerService = new CustomerService();
        this.productService = new ProductService();
    }
}

// Export service types
export type { CustomerService } from './customer.service';
export type { ProductService } from './product.service';

// Export a default instance
export const services = ServiceRegistry.getInstance();