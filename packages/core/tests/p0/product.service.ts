import { Product, IProduct } from '../models/product';
import mongoose from 'mongoose';

export interface SearchOptions {
  query?: string;
  category?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}

/**
 * ProductService - Mock implementation for tests
 * Used by MEXP-2025-027-BE Product Catalog tests
 */
export class ProductService {
  /**
   * Create a new product
   */
  async create(productData: Partial<IProduct>) {
    const product = new Product(productData);
    return await product.save();
  }

  /**
   * Find product by ID
   */
  async findById(id: mongoose.Types.ObjectId | string) {
    const product = await Product.findById(id).lean();
    if (!product) return null;
    return {
      ...product,
      _id: product._id.toString()
    };
  }

  /**
   * Find all products
   */
  async findAll() {
    const products = await Product.find().lean();
    return products.map(product => ({
      ...product,
      _id: product._id.toString()
    }));
  }

  /**
   * Update product
   */
  async update(
    id: mongoose.Types.ObjectId | string,
    updateData: Partial<IProduct>
  ) {
    // Direct approach that works with our mocks
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { 
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      }
    );
    
    if (!product) return null;
    
    return product;
  }

  /**
   * Delete product
   */
  async delete(id: mongoose.Types.ObjectId | string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id).lean();
    return result !== null;
  }

  /**
   * Search products
   */
  async search(options: SearchOptions) {
    const { query, category, tag, limit = 10, offset = 0 } = options;

    const searchCriteria: any = {};

    if (query) {
      const searchRegex = new RegExp(query, 'i');
      searchCriteria.$or = [
        { name: searchRegex },
        { sku: searchRegex },
        { description: searchRegex }
      ];
    }

    if (category) {
      searchCriteria.category = category;
    }

    if (tag) {
      searchCriteria.tags = tag;
    }
    
    const products = await Product.find(searchCriteria)
      .skip(offset)
      .limit(limit)
      .lean();

    return products.map(product => ({
      ...product,
      _id: product._id.toString()
    }));
  }
}