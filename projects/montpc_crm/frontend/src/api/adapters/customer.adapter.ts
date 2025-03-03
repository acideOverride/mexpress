import { Customer as ApiCustomer } from '../types/customer';
import { Customer as UiCustomer, Address } from '../../types/customer';

// Extended Address interface with country field
export interface ExtendedAddress extends Address {
  country?: string;
}

/**
 * Converts an API customer (with string address) to UI customer (with structured address)
 */
export const apiToUiCustomer = (apiCustomer: ApiCustomer | any): UiCustomer => {
  // Parse the address string if it exists
  let address: ExtendedAddress | undefined = undefined;

  if (apiCustomer.address) {
    try {
      // Try to parse it as JSON first
      const parsedAddress = JSON.parse(apiCustomer.address);
      
      // Create an extended address with all fields
      address = {
        street: parsedAddress.street || '',
        city: parsedAddress.city || '',
        state: parsedAddress.state || '',
        zip: parsedAddress.zip || '',
        country: parsedAddress.country || ''
      };
    } catch (e) {
      // If parsing fails, create a simple object with just the string
      address = {
        street: apiCustomer.address,
        city: '',
        state: '',
        zip: '',
        country: ''
      };
    }
  }

  return {
    ...apiCustomer,
    address,
    status: 'ACTIVE', // Default status if not available in API
    createdAt: apiCustomer.createdAt, // API returns string, UI component expects string
    updatedAt: apiCustomer.updatedAt, // API returns string, UI component expects string
  };
};

/**
 * Converts a UI customer (with structured address) to API customer (with string address)
 */
export const uiToApiCustomer = (uiCustomer: UiCustomer): ApiCustomer => {
  const { address, status, ...rest } = uiCustomer;
  
  return {
    ...rest,
    address: address ? JSON.stringify(address) : undefined,
    createdAt: typeof uiCustomer.createdAt === 'object' 
      ? uiCustomer.createdAt.toISOString() 
      : uiCustomer.createdAt,
    updatedAt: typeof uiCustomer.updatedAt === 'object'
      ? uiCustomer.updatedAt.toISOString()
      : uiCustomer.updatedAt,
  };
};