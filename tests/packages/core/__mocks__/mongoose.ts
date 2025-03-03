/**
 * Mongoose mock implementation
 */
const mongoose = jest.createMockFromModule('mongoose');

// Mock the Model class
class MockModel {
  static findOne = jest.fn();
  static find = jest.fn();
  static findById = jest.fn();
  static create = jest.fn();
  static updateOne = jest.fn();
  static deleteOne = jest.fn();
  
  save = jest.fn();
  
  constructor(data) {
    Object.assign(this, data);
  }
}

// Create a function to generate model mocks
function model(name) {
  return MockModel;
}

// Set the model function on the mongoose mock
mongoose.model = model;

// Mock Schema implementation
class Schema {
  constructor(definition, options) {
    this.definition = definition;
    this.options = options;
  }
}

mongoose.Schema = Schema;

// Mock connect implementation
mongoose.connect = jest.fn().mockResolvedValue(mongoose);

// Mock connection implementation
mongoose.connection = {
  on: jest.fn(),
  once: jest.fn(),
  close: jest.fn()
};

module.exports = mongoose;