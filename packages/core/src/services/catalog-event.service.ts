import { EventEmitter } from 'events';
import { Types } from 'mongoose';
import { productEvents } from '../models/product';
import { categoryEvents } from '../models/category';

interface ProductCreatedEvent {
  productId: Types.ObjectId;
  sku: string;
  status: string;
  timestamp: Date;
}

interface ProductUpdatedEvent {
  productId: Types.ObjectId;
  changes: Record<string, any>;
  timestamp: Date;
}

interface CategoryCreatedEvent {
  categoryId: Types.ObjectId;
  slug: string;
  timestamp: Date;
}

interface CategoryUpdatedEvent {
  categoryId: Types.ObjectId;
  changes: Record<string, any>;
  timestamp: Date;
}

interface ProductCategoryAssignedEvent {
  productId: Types.ObjectId;
  categoryId: Types.ObjectId;
  timestamp: Date;
}

type EventHandler<T> = (event: T) => void;

export class CatalogEventService {
  private emitter: EventEmitter;
  private readonly PRODUCT_CREATED = 'product:created';
  private readonly PRODUCT_UPDATED = 'product:updated';
  private readonly CATEGORY_CREATED = 'category:created';
  private readonly CATEGORY_UPDATED = 'category:updated';
  private readonly PRODUCT_CATEGORY_ASSIGNED = 'product:category:assigned';

  constructor() {
    this.emitter = new EventEmitter();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Product events
    productEvents.on('created', (event: ProductCreatedEvent) => {
      this.emitter.emit(this.PRODUCT_CREATED, event);
    });

    productEvents.on('updated', (event: ProductUpdatedEvent) => {
      this.emitter.emit(this.PRODUCT_UPDATED, event);
    });

    productEvents.on('category_assigned', (event: ProductCategoryAssignedEvent) => {
      this.emitter.emit(this.PRODUCT_CATEGORY_ASSIGNED, event);
    });

    // Category events
    categoryEvents.on('created', (event: CategoryCreatedEvent) => {
      this.emitter.emit(this.CATEGORY_CREATED, event);
    });

    categoryEvents.on('updated', (event: CategoryUpdatedEvent) => {
      this.emitter.emit(this.CATEGORY_UPDATED, event);
    });
  }

  onProductCreated(handler: EventHandler<ProductCreatedEvent>): () => void {
    this.emitter.on(this.PRODUCT_CREATED, handler);
    return () => this.emitter.off(this.PRODUCT_CREATED, handler);
  }

  onProductUpdated(handler: EventHandler<ProductUpdatedEvent>): () => void {
    this.emitter.on(this.PRODUCT_UPDATED, handler);
    return () => this.emitter.off(this.PRODUCT_UPDATED, handler);
  }

  onCategoryCreated(handler: EventHandler<CategoryCreatedEvent>): () => void {
    this.emitter.on(this.CATEGORY_CREATED, handler);
    return () => this.emitter.off(this.CATEGORY_CREATED, handler);
  }

  onCategoryUpdated(handler: EventHandler<CategoryUpdatedEvent>): () => void {
    this.emitter.on(this.CATEGORY_UPDATED, handler);
    return () => this.emitter.off(this.CATEGORY_UPDATED, handler);
  }

  onProductCategoryAssigned(handler: EventHandler<ProductCategoryAssignedEvent>): () => void {
    this.emitter.on(this.PRODUCT_CATEGORY_ASSIGNED, handler);
    return () => this.emitter.off(this.PRODUCT_CATEGORY_ASSIGNED, handler);
  }

  removeAllListeners(): void {
    this.emitter.removeAllListeners();
    productEvents.removeAllListeners();
    categoryEvents.removeAllListeners();
  }
}