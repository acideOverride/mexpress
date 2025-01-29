import { db } from '../db/memory';
import { Customer, Repair } from '../db/memory';

type SearchableCustomerFields = keyof Pick<Customer, 'name' | 'email' | 'phone' | 'address' | 'notes'>;
type SearchableRepairFields = keyof Pick<Repair, 'deviceType' | 'issue' | 'status' | 'priority' | 'description'>;

interface SearchOptions {
  type?: 'all' | 'customers' | 'repairs';
  customerFields?: SearchableCustomerFields[];
  repairFields?: SearchableRepairFields[];
}

interface SearchResult {
  customers: Customer[];
  repairs: Repair[];
}

export class SearchService {
  private static normalizeString(str: string | undefined | null): string {
    return (str || '').toLowerCase().trim();
  }

  private static matchesSearch(text: string | undefined | null, query: string): boolean {
    if (!text) return false;
    return this.normalizeString(text).includes(this.normalizeString(query));
  }

  private static async searchCustomers(query: string, fields?: SearchableCustomerFields[]): Promise<Customer[]> {
    const searchFields = fields || ['name', 'email', 'phone', 'address', 'notes'];
    const customers = await db.getCustomers();
    console.log('Searching customers:', customers); // Debug log

    return customers.filter(customer => 
      searchFields.some(field => {
        const value = customer[field];
        return this.matchesSearch(value?.toString(), query);
      })
    );
  }

  private static async searchRepairs(query: string, fields?: SearchableRepairFields[]): Promise<Repair[]> {
    const searchFields = fields || ['deviceType', 'issue', 'status', 'priority', 'description'];
    const repairs = await db.getRepairs();
    console.log('Searching repairs:', repairs); // Debug log

    return repairs.filter(repair => 
      searchFields.some(field => {
        const value = repair[field];
        return this.matchesSearch(value?.toString(), query);
      })
    );
  }

  static async search(query: string, options: SearchOptions = {}): Promise<SearchResult> {
    console.log('Search query:', query, 'options:', options); // Debug log
    
    const { type = 'all', customerFields, repairFields } = options;
    
    const results: SearchResult = {
      customers: [],
      repairs: []
    };

    if (type === 'all' || type === 'customers') {
      results.customers = await this.searchCustomers(query, customerFields);
    }

    if (type === 'all' || type === 'repairs') {
      results.repairs = await this.searchRepairs(query, repairFields);
    }

    console.log('Search results:', results); // Debug log
    return results;
  }
}
