import mongoose from 'mongoose';
import { StockTransaction, IStockTransaction } from '../models/stockTransaction';
import { Product } from '../models/product';

export class StockService {
  /**
   * Create a new stock transaction
   */
  async createTransaction(transactionData: Partial<IStockTransaction>) {
    // Verify product exists
    const product = await Product.findById(transactionData.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Create transaction
    const transaction = new StockTransaction(transactionData);
    return await transaction.save();
  }

  /**
   * Process a stock transaction
   */
  async processTransaction(transactionId: mongoose.Types.ObjectId | string) {
    const transaction = await StockTransaction.findById(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Get product
    const product = await Product.findById(transaction.productId);
    if (!product) {
      transaction.status = 'failed';
      await transaction.save();
      throw new Error('Product not found');
    }

    try {
      // Process based on transaction type
      if (transaction.type === 'increment') {
        product.stockLevel += transaction.quantity;
      } else {
        // Validate sufficient stock for decrement
        if (product.stockLevel < transaction.quantity) {
          transaction.status = 'failed';
          await transaction.save();
          return transaction;
        }
        product.stockLevel -= transaction.quantity;
      }

      // Save product and update transaction
      await product.save();
      transaction.status = 'completed';
      return await transaction.save();
    } catch (error) {
      transaction.status = 'failed';
      await transaction.save();
      throw error;
    }
  }

  /**
   * Get transaction history for a product
   */
  async getTransactionHistory(productId: mongoose.Types.ObjectId | string) {
    return await StockTransaction.find({ productId })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Get current stock level for a product
   */
  async getStockLevel(productId: mongoose.Types.ObjectId | string) {
    const product = await Product.findById(productId);
    return product ? product.stockLevel : null;
  }

  /**
   * Validate if product has sufficient stock
   */
  async validateStockLevel(
    productId: mongoose.Types.ObjectId | string,
    quantity: number
  ): Promise<boolean> {
    const product = await Product.findById(productId);
    if (!product) {
      return false;
    }
    return product.stockLevel >= quantity;
  }
}