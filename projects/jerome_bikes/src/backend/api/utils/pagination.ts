/**
 * Pagination Utilities
 * Functions for handling paginated responses
 */
import { Request } from 'express';

/**
 * Interface for pagination options
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
}

/**
 * Interface for pagination metadata
 */
export interface PaginationMetadata {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Interface for paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  metadata: PaginationMetadata;
}

/**
 * Extract pagination options from request
 * @param req Express request
 * @param defaultLimit Default items per page
 */
export const getPaginationOptions = (req: Request, defaultLimit: number = 10): PaginationOptions => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || defaultLimit));
  const sort = req.query.sort as string || undefined;
  
  return { page, limit, sort };
};

/**
 * Generate pagination metadata
 * @param page Current page
 * @param limit Items per page
 * @param totalItems Total number of items
 */
export const getPaginationMetadata = (
  page: number,
  limit: number,
  totalItems: number
): PaginationMetadata => {
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    itemsPerPage: limit,
    totalItems,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};

/**
 * Create a paginated response
 * @param data Array of items
 * @param metadata Pagination metadata
 */
export const createPaginatedResponse = <T>(
  data: T[],
  metadata: PaginationMetadata
): PaginatedResponse<T> => {
  return {
    data,
    metadata,
  };
};