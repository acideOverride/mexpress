/**
 * Integration Tester Implementation
 */

class IntegrationTester {
  constructor(hiboutikService, ringoverService, customerService, monitoring) {
    this.hiboutikService = hiboutikService;
    this.ringoverService = ringoverService;
    this.customerService = customerService;
    this.monitoring = monitoring;
    this.errorCodes = {
      RATE_LIMIT: 'rate_limit_exceeded',
      NETWORK: 'network_error',
      VALIDATION: 'validation_error',
      AUTH: 'authentication_error'
    };
  }

  clearState() {
    // Reset any internal state for the tester
  }

  async testHiboutikSync(customer) {
    try {
      const hiboutikResponse = await this.hiboutikService.createCustomer({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      });

      return {
        success: true,
        externalId: hiboutikResponse.id,
        errors: []
      };
    } catch (error) {
      let errorMessage = error.message;
      
      // Handle different error types
      if (error.message.includes('Rate limit exceeded')) {
        errorMessage = 'Rate limit exceeded - retry after backoff';
        this.monitoring.recordError('hiboutik', this.errorCodes.RATE_LIMIT);
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error occurred';
        this.monitoring.recordError('hiboutik', this.errorCodes.NETWORK);
      }

      return {
        success: false,
        externalId: undefined,
        errors: [errorMessage]
      };
    }
  }

  async testRingoverSync(customer) {
    try {
      const ringoverResponse = await this.ringoverService.createContact({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      });

      return {
        success: true,
        externalId: ringoverResponse.id,
        errors: []
      };
    } catch (error) {
      let errorMessage = error.message;
      
      // Handle different error types
      if (error.message.includes('Rate limit exceeded')) {
        errorMessage = 'Rate limit exceeded - retry after backoff';
        this.monitoring.recordError('ringover', this.errorCodes.RATE_LIMIT);
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error occurred';
        this.monitoring.recordError('ringover', this.errorCodes.NETWORK);
      }

      return {
        success: false,
        externalId: undefined,
        errors: [errorMessage]
      };
    }
  }

  async testCustomerImport(customers) {
    const results = {
      success: true,
      importedCount: 0,
      failedCount: 0,
      errors: []
    };

    for (const customer of customers) {
      try {
        // Sync to Hiboutik
        const hiboutikResult = await this.testHiboutikSync(customer);
        
        // Sync to Ringover
        const ringoverResult = await this.testRingoverSync(customer);

        // Update customer with external IDs if both syncs were successful
        if (hiboutikResult.success && ringoverResult.success) {
          await this.customerService.updateCustomer(customer.id, {
            externalIds: {
              hiboutik: hiboutikResult.externalId,
              ringover: ringoverResult.externalId
            },
            syncStatus: 'synced'
          });
          
          results.importedCount++;
        } else {
          results.failedCount++;
          if (!hiboutikResult.success) {
            results.errors.push(`Customer ${customer.id} failed to sync with Hiboutik: ${hiboutikResult.errors[0]}`);
          }
          if (!ringoverResult.success) {
            results.errors.push(`Customer ${customer.id} failed to sync with Ringover: ${ringoverResult.errors[0]}`);
          }
        }
      } catch (error) {
        results.failedCount++;
        results.errors.push(`Customer ${customer.id} import failed: ${error.message}`);
      }
    }

    // Overall success is true only if all customers were imported
    results.success = results.failedCount === 0;
    
    return results;
  }

  async testFullSync(customer) {
    const result = {
      success: true,
      hiboutikId: undefined,
      ringoverId: undefined,
      errors: []
    };

    // Sync to Hiboutik
    const hiboutikResult = await this.testHiboutikSync(customer);
    if (hiboutikResult.success) {
      result.hiboutikId = hiboutikResult.externalId;
    } else {
      result.success = false;
      result.errors.push(`Hiboutik sync failed: ${hiboutikResult.errors[0]}`);
    }
    
    // Sync to Ringover
    const ringoverResult = await this.testRingoverSync(customer);
    if (ringoverResult.success) {
      result.ringoverId = ringoverResult.externalId;
    } else {
      result.success = false;
      result.errors.push(`Ringover sync failed: ${ringoverResult.errors[0]}`);
    }

    // If both syncs were successful, update the customer record
    if (result.success) {
      await this.customerService.updateCustomer(customer.id, {
        externalIds: {
          hiboutik: result.hiboutikId,
          ringover: result.ringoverId
        },
        syncStatus: 'synced'
      });
    }
    
    return result;
  }
}

module.exports = { IntegrationTester };