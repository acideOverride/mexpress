// Type declarations for resolving the CustomerDetail component type issues

// Allow any-typed components in this specific context
declare module '@tanstack/react-query' {
  interface UseQueryOptions<TData = unknown, TError = unknown> {
    queryFn?: () => Promise<TData>;
  }
}

// Allow type merging for Customer
declare namespace Customer {
  interface Customer {
    address?: string | {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
  }
}