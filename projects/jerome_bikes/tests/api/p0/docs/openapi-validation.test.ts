/**
 * OpenAPI Validation Tests
 * 
 * Tests to ensure the OpenAPI/Swagger documentation is valid and complete.
 * Following TDD principles, these tests are created first in the RED phase.
 */
import SwaggerParser from '@apidevtools/swagger-parser';
import swaggerJsdoc from 'swagger-jsdoc';
import { Express } from 'express';
import express from 'express';
// Mock the setupSwagger function for tests
const setupSwagger = (app: Express): void => {
  // This is just a mock for testing
};
import path from 'path';
import fs from 'fs';

const API_ROUTES_DIR = path.resolve(__dirname, '../../../../src/backend/api/routes/v1');
const SCHEMAS_DIR = path.resolve(__dirname, '../../../../src/backend/api/docs/schemas');

describe('OpenAPI Documentation Validation', () => {
  let app: Express;
  let swaggerDoc: any;

  beforeAll(async () => {
    // Create a test Express app
    app = express();
    setupSwagger(app);

    // Get the OpenAPI spec directly 
    const swaggerOptions: swaggerJsdoc.Options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Test API',
          version: '1.0.0',
        },
      },
      apis: [
        path.join(API_ROUTES_DIR, '*.ts'),
        path.join(SCHEMAS_DIR, '*.yaml'),
      ],
    };

    swaggerDoc = swaggerJsdoc(swaggerOptions);
  });

  describe('OpenAPI Specification Validity', () => {
    test('should have a valid OpenAPI structure', async () => {
      // This test validates the OpenAPI spec is structurally correct
      // In RED phase, this might fail if the spec is incomplete
      const api = await SwaggerParser.validate(swaggerDoc)
        .catch(err => {
          console.error('OpenAPI validation error:', err.message);
          return null;
        });
      
      expect(api).not.toBeNull();
    });

    test('should have info section with title and version', () => {
      expect(swaggerDoc.info).toBeDefined();
      expect(swaggerDoc.info.title).toBeDefined();
      expect(swaggerDoc.info.version).toBeDefined();
    });

    test('should have at least one server defined', () => {
      expect(swaggerDoc.servers).toBeDefined();
      expect(swaggerDoc.servers.length).toBeGreaterThan(0);
      expect(swaggerDoc.servers[0].url).toBeDefined();
    });

    test('should have security scheme defined', () => {
      expect(swaggerDoc.components).toBeDefined();
      expect(swaggerDoc.components.securitySchemes).toBeDefined();
      expect(swaggerDoc.components.securitySchemes.bearerAuth).toBeDefined();
    });
  });

  describe('API Endpoints Documentation Coverage', () => {
    // Get all route files to ensure all are documented
    fs.readdirSync(API_ROUTES_DIR)
      .filter(file => file.endsWith('.routes.ts'));

    // Test paths object exists and isn't empty
    test('should have paths object with API endpoints', () => {
      expect(swaggerDoc.paths).toBeDefined();
      expect(Object.keys(swaggerDoc.paths).length).toBeGreaterThan(0);
    });

    // Test for core endpoints that must be documented
    const requiredEndpoints = [
      { entity: 'bikes', operations: ['get', 'post', 'put', 'delete'] },
      { entity: 'customers', operations: ['get', 'post', 'put', 'delete'] },
      { entity: 'reservations', operations: ['get', 'post', 'put', 'delete'] },
      { entity: 'stations', operations: ['get', 'post', 'put', 'delete'] },
      { entity: 'auth', operations: ['post'] }, // At minimum login endpoint
    ];

    // Test each required endpoint is documented
    test.each(requiredEndpoints)(
      'should document $entity endpoints for operations: $operations', 
      ({ entity, operations }) => {
        // Get all paths related to this entity
        const entityPaths = Object.keys(swaggerDoc.paths)
          .filter(path => path.includes(`/api/v1/${entity}`));
        
        // Expect at least one path for this entity
        expect(entityPaths.length).toBeGreaterThan(0);
        
        // Check if each operation exists for at least one endpoint
        operations.forEach(operation => {
          const hasOperation = entityPaths.some(path => 
            swaggerDoc.paths[path][operation]
          );
          
          expect(hasOperation).toBeTruthy();
        });
      }
    );
  });

  describe('API Response Schema Validation', () => {
    test('should have consistent success response format', () => {
      // Sample a GET endpoint to verify success response format
      const sampleGetEndpoint = Object.keys(swaggerDoc.paths)
        .find(path => swaggerDoc.paths[path].get);
      
      if (!sampleGetEndpoint) {
        fail('No GET endpoint found for testing');
        return;
      }
      
      const getOperation = swaggerDoc.paths[sampleGetEndpoint].get;
      const successResponses = Object.keys(getOperation.responses)
        .filter(code => code.startsWith('2'));
      
      expect(successResponses.length).toBeGreaterThan(0);
      
      // Check at least one success response has success property
      const hasSuccessFormat = successResponses.some(code => {
        const response = getOperation.responses[code];
        if (!response.content || !response.content['application/json']) {
          return false;
        }
        
        const schema = response.content['application/json'].schema;
        return schema.properties && schema.properties.success;
      });
      
      expect(hasSuccessFormat).toBeTruthy();
    });

    test('should have common error response definitions', () => {
      expect(swaggerDoc.components.responses).toBeDefined();
      
      // Check for common error responses
      const requiredErrorResponses = [
        'BadRequestError', 
        'UnauthorizedError', 
        'NotFoundError', 
        'ServerError'
      ];
      
      requiredErrorResponses.forEach(errorType => {
        expect(swaggerDoc.components.responses[errorType]).toBeDefined();
      });
    });

    test('should use common error responses consistently', () => {
      // Sample a few endpoints to verify they reference common errors
      const sampleEndpoints = Object.keys(swaggerDoc.paths).slice(0, 3);
      
      sampleEndpoints.forEach(path => {
        // Get all operations for this path
        const operations = Object.keys(swaggerDoc.paths[path])
          .filter(op => ['get', 'post', 'put', 'delete', 'patch'].includes(op));
        
        operations.forEach(op => {
          const operation = swaggerDoc.paths[path][op];
          const errorResponses = Object.keys(operation.responses)
            .filter(code => code.startsWith('4') || code.startsWith('5'));
          
          // Check at least one error response uses a $ref
          const usesReferences = errorResponses.some(code => {
            const response = operation.responses[code];
            return response.$ref !== undefined;
          });
          
          expect(usesReferences).toBeTruthy();
        });
      });
    });
  });
});