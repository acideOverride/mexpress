import { HiboutikService, HiboutikCustomer } from './hiboutik.service';
import { RingoverService, RingoverCall } from './ringover.service';

export interface CustomerCallRecord {
  customerId: string;
  customerName: string;
  callId: string;
  callTime: Date;
  duration: number;
  status: string;
  recording: string;
}

export class SyncService {
  constructor(
    private hiboutikService: HiboutikService,
    private ringoverService: RingoverService
  ) {}

  /**
   * Get call history for a specific customer
   */
  async getCustomerCallHistory(customerId: string): Promise<CustomerCallRecord[]> {
    try {
      // Get customer details
      const customer = await this.hiboutikService.getCustomerById(customerId);
      
      try {
        // Get all recent calls
        const calls = await this.ringoverService.getRecentCalls();
        
        // Filter and map calls for this customer
        return this.matchCustomerCalls(customer, calls);
      } catch (ringoverError) {
        // Wrap Ringover service errors
        if (ringoverError instanceof Error) {
          throw new Error(`Failed to fetch call history: ${ringoverError.message}`);
        }
        throw ringoverError;
      }
    } catch (error) {
      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message === 'Customer not found' ||
            error.message.includes('Rate limit') || 
            error.message.includes('Network error') ||
            error.message.includes('Server error') ||
            error.message.includes('Failed to fetch call history')) {
          throw error;
        }
      }
      // Re-throw unknown errors
      throw error;
    }
  }

  /**
   * Match customer with their calls
   */
  private matchCustomerCalls(customer: HiboutikCustomer, calls: RingoverCall[]): CustomerCallRecord[] {
    // Normalize phone numbers for comparison
    const customerPhone = this.normalizePhoneNumber(customer.phone);
    
    // Filter calls where customer is either caller or recipient
    return calls
      .filter(call => 
        this.normalizePhoneNumber(call.callerNumber) === customerPhone ||
        this.normalizePhoneNumber(call.recipientNumber) === customerPhone
      )
      .map(call => ({
        customerId: customer.id!,
        customerName: `${customer.firstName} ${customer.lastName}`,
        callId: call.id,
        callTime: call.timestamp,
        duration: call.durationSeconds,
        status: call.status,
        recording: call.recordingUrl
      }));
  }

  /**
   * Normalize phone number for comparison
   * Removes spaces, dashes, and other non-digit characters
   * Ensures consistent format with country code
   */
  private normalizePhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If number starts with '+' or '00', assume it's already in international format
    if (phone.startsWith('+') || phone.startsWith('00')) {
      return digits;
    }
    
    // Otherwise, assume it's a local number and add default country code
    // This should be configurable based on the business location
    return `33${digits.replace(/^0/, '')}`; // French numbers (configurable)
  }
}