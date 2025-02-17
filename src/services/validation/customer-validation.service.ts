import { RetryStrategy } from '../../lib/resilience/retry-strategy';
import { CustomerModel, Customer } from '../../models/customer';

export interface CustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingCustomer?: Customer;
  matchedFields: string[];
}

export class CustomerValidationService {
  private readonly retryStrategy: RetryStrategy;

  constructor() {
    this.retryStrategy = new RetryStrategy({
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 5000,
      exponentialBackoff: true,
      jitter: true
    });
  }

  public async validateCustomer(input: CustomerInput): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // Basic field validation
    if (!this.isValidName(input.firstName)) {
      errors.push({
        field: 'firstName',
        message: 'First name must be 2-50 characters long and contain only letters',
        code: 'INVALID_FIRST_NAME'
      });
    }

    if (!this.isValidName(input.lastName)) {
      errors.push({
        field: 'lastName',
        message: 'Last name must be 2-50 characters long and contain only letters',
        code: 'INVALID_LAST_NAME'
      });
    }

    if (!this.isValidEmail(input.email)) {
      errors.push({
        field: 'email',
        message: 'Invalid email format',
        code: 'INVALID_EMAIL'
      });
    }

    if (!this.isValidPhone(input.phone)) {
      errors.push({
        field: 'phone',
        message: 'Invalid phone number format (E.164 required)',
        code: 'INVALID_PHONE'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public async checkDuplicates(input: CustomerInput): Promise<DuplicateCheckResult> {
    return this.retryStrategy.execute<DuplicateCheckResult>(async () => {
      const matchedFields: string[] = [];
      
      // Check email
      const emailMatch = await CustomerModel.findOne({ email: input.email.toLowerCase() });
      if (emailMatch) {
        matchedFields.push('email');
      }

      // Check phone (normalized)
      const normalizedPhone = this.normalizePhone(input.phone);
      const phoneMatch = await CustomerModel.findOne({ phone: normalizedPhone });
      if (phoneMatch) {
        matchedFields.push('phone');
      }

      // Check name combination
      const nameMatch = await CustomerModel.findOne({
        firstName: new RegExp(`^${input.firstName}$`, 'i'),
        lastName: new RegExp(`^${input.lastName}$`, 'i')
      });
      if (nameMatch) {
        matchedFields.push('name');
      }

      return {
        isDuplicate: matchedFields.length > 0,
        existingCustomer: emailMatch || phoneMatch || nameMatch || undefined,
        matchedFields
      };
    });
  }

  private isValidName(name: string): boolean {
    return /^[A-Za-z\s-]{2,50}$/.test(name.trim());
  }

  private isValidEmail(email: string): boolean {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.toLowerCase());
  }

  private isValidPhone(phone: string): boolean {
    const normalized = this.normalizePhone(phone);
    return /^\+[1-9]\d{1,14}$/.test(normalized);
  }

  private normalizePhone(phone: string): string {
    let normalized = phone.replace(/\s+/g, '');
    if (!normalized.startsWith('+')) {
      normalized = '+' + normalized;
    }
    return normalized;
  }

  public async verifyExternalIds(externalIds: { hiboutik?: string; ringover?: string }): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    if (externalIds.hiboutik) {
      const isValidHiboutik = await this.verifyHiboutikId(externalIds.hiboutik);
      if (!isValidHiboutik) {
        errors.push({
          field: 'externalIds.hiboutik',
          message: 'Invalid Hiboutik ID',
          code: 'INVALID_HIBOUTIK_ID'
        });
      }
    }

    if (externalIds.ringover) {
      const isValidRingover = await this.verifyRingoverId(externalIds.ringover);
      if (!isValidRingover) {
        errors.push({
          field: 'externalIds.ringover',
          message: 'Invalid Ringover ID',
          code: 'INVALID_RINGOVER_ID'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private async verifyHiboutikId(id: string): Promise<boolean> {
    // TODO: Implement actual Hiboutik API verification
    return true;
  }

  private async verifyRingoverId(id: string): Promise<boolean> {
    // TODO: Implement actual Ringover API verification
    return true;
  }
}