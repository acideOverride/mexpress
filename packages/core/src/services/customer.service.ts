import { Customer, CreateCustomerDto, UpdateCustomerDto } from '../models/customer';
import { CustomerModel, CustomerDocument } from '../models/customer.schema';
import mongoose from 'mongoose';

export class CustomerError extends Error {
    constructor(message: string, public code: 'DUPLICATE_EMAIL' | 'INVALID_ID' | 'NOT_FOUND' | 'VALIDATION_ERROR') {
        super(message);
        this.name = 'CustomerError';
    }
}

export class CustomerService {
    async create(dto: CreateCustomerDto): Promise<Customer> {
        try {
            const customer = new CustomerModel(dto);
            return await customer.save();
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                throw new CustomerError('Validation failed: ' + error.message, 'VALIDATION_ERROR');
            }
            if ((error as any).code === 11000) { // MongoDB duplicate key error
                throw new CustomerError('Email already exists', 'DUPLICATE_EMAIL');
            }
            throw error;
        }
    }

    async findAll(): Promise<Customer[]> {
        return CustomerModel.find().exec();
    }

    async findById(id: string): Promise<Customer | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new CustomerError('Invalid customer ID', 'INVALID_ID');
        }
        return CustomerModel.findById(id).exec();
    }

    async update(id: string, dto: UpdateCustomerDto): Promise<Customer | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new CustomerError('Invalid customer ID', 'INVALID_ID');
        }

        try {
            const customer = await CustomerModel.findByIdAndUpdate(
                id,
                { ...dto, updatedAt: new Date() },
                { new: true, runValidators: true }
            ).exec();

            if (!customer) {
                throw new CustomerError('Customer not found', 'NOT_FOUND');
            }

            return customer;
        } catch (error) {
            if (error instanceof CustomerError) {
                throw error;
            }
            if (error instanceof mongoose.Error.ValidationError) {
                throw new CustomerError('Validation failed: ' + error.message, 'VALIDATION_ERROR');
            }
            if ((error as any).code === 11000) {
                throw new CustomerError('Email already exists', 'DUPLICATE_EMAIL');
            }
            throw error;
        }
    }

    async delete(id: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new CustomerError('Invalid customer ID', 'INVALID_ID');
        }

        const result = await CustomerModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new CustomerError('Customer not found', 'NOT_FOUND');
        }
        return true;
    }

    async findByEmail(email: string): Promise<Customer | null> {
        if (!email || typeof email !== 'string') {
            throw new CustomerError('Invalid email', 'VALIDATION_ERROR');
        }
        return CustomerModel.findOne({ email }).exec();
    }

    async search(query: string): Promise<Customer[]> {
        if (!query || typeof query !== 'string') {
            throw new CustomerError('Invalid search query', 'VALIDATION_ERROR');
        }

        // Use text search for better performance when possible
        if (query.length >= 3) {
            try {
                const textSearchResults = await CustomerModel.find(
                    { $text: { $search: query } },
                    { score: { $meta: 'textScore' } }
                )
                .sort({ score: { $meta: 'textScore' } })
                .exec();

                if (textSearchResults.length > 0) {
                    return textSearchResults;
                }
            } catch (error) {
                // Fallback to regex if text search fails
                console.error('Text search failed, falling back to regex:', error);
            }
        }

        // Fallback to regex search for shorter queries or if text search returns no results
        const searchPattern = new RegExp(query, 'i');
        return CustomerModel.find({
            $or: [
                { name: searchPattern },
                { email: searchPattern },
                { phone: searchPattern },
                { 'address.city': searchPattern }
            ]
        }).exec();
    }
}