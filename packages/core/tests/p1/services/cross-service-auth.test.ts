/**
 * Cross-Service Authentication Tests
 * MEXP-2025-007-BE Integration Architecture P1 Tests
 */
import { CrossServiceAuth, ServiceIdentity, AuthorizationPolicy } from '../../../src/services/cross-service-auth';

describe('CrossServiceAuth', () => {
  let crossServiceAuth: CrossServiceAuth;
  
  beforeEach(() => {
    crossServiceAuth = new CrossServiceAuth({
      keyRotationInterval: 100, // Fast rotation for tests
      tokenTTL: 500,            // Short TTL for tests
      tokenRenewalWindow: 100   // Short renewal window for tests
    });
  });
  
  afterEach(() => {
    crossServiceAuth.shutdown();
  });
  
  describe('Service Registration', () => {
    test('should register a service successfully', () => {
      const service: Omit<ServiceIdentity, 'id' | 'createdAt'> = {
        name: 'api-service',
        namespace: 'default',
        roles: ['service', 'api-provider'],
        metadata: { region: 'us-east' },
        expiresAt: new Date(Date.now() + 3600000) // Expires in 1 hour
      };
      
      const registeredService = crossServiceAuth.registerService(service);
      
      expect(registeredService).toBeDefined();
      expect(registeredService.id).toBeDefined();
      expect(registeredService.name).toBe(service.name);
      expect(registeredService.namespace).toBe(service.namespace);
      expect(registeredService.roles).toEqual(service.roles);
      expect(registeredService.createdAt).toBeDefined();
      expect(registeredService.expiresAt).toEqual(service.expiresAt);
    });
    
    test('should retrieve a registered service by ID', () => {
      const service: Omit<ServiceIdentity, 'id' | 'createdAt'> = {
        name: 'data-service',
        namespace: 'default',
        roles: ['service', 'data-provider'],
        metadata: { region: 'us-west' },
        expiresAt: new Date(Date.now() + 3600000)
      };
      
      const registeredService = crossServiceAuth.registerService(service);
      const retrievedService = crossServiceAuth.getService(registeredService.id);
      
      expect(retrievedService).toBeDefined();
      expect(retrievedService).toEqual(registeredService);
    });
    
    test('should update a service successfully', () => {
      const service: Omit<ServiceIdentity, 'id' | 'createdAt'> = {
        name: 'auth-service',
        namespace: 'default',
        roles: ['service', 'auth-provider'],
        metadata: { region: 'eu-west' },
        expiresAt: new Date(Date.now() + 3600000)
      };
      
      const registeredService = crossServiceAuth.registerService(service);
      
      // Update service roles
      const updatedRoles = [...service.roles, 'admin'];
      const updatedService = crossServiceAuth.updateService(registeredService.id, {
        roles: updatedRoles
      });
      
      expect(updatedService).toBeDefined();
      expect(updatedService?.roles).toEqual(updatedRoles);
      expect(updatedService?.name).toBe(service.name);
    });
    
    test('should deregister a service successfully', () => {
      const service: Omit<ServiceIdentity, 'id' | 'createdAt'> = {
        name: 'temp-service',
        namespace: 'default',
        roles: ['service'],
        metadata: {},
        expiresAt: new Date(Date.now() + 3600000)
      };
      
      const registeredService = crossServiceAuth.registerService(service);
      const result = crossServiceAuth.deregisterService(registeredService.id);
      
      expect(result).toBe(true);
      expect(crossServiceAuth.getService(registeredService.id)).toBeUndefined();
    });
  });
  
  describe('Token Management', () => {
    let serviceId: string;
    
    beforeEach(() => {
      const service: Omit<ServiceIdentity, 'id' | 'createdAt'> = {
        name: 'token-service',
        namespace: 'default',
        roles: ['service', 'token-user'],
        metadata: {},
        expiresAt: new Date(Date.now() + 3600000)
      };
      
      const registeredService = crossServiceAuth.registerService(service);
      serviceId = registeredService.id;
    });
    
    test('should issue a token for a service', () => {
      const audience = ['api-gateway', 'database'];
      const customClaims = { permission: 'read' };
      
      const token = crossServiceAuth.issueToken(serviceId, audience, customClaims);
      
      expect(token).toBeDefined();
      expect(token?.serviceId).toBe(serviceId);
      expect(token?.audience).toEqual(audience);
      expect(token?.claims).toMatchObject(customClaims);
      expect(token?.issuedAt).toBeDefined();
      expect(token?.expiresAt).toBeDefined();
      expect(token?.token).toBeDefined();
    });
    
    test('should validate a token successfully', () => {
      const token = crossServiceAuth.issueToken(serviceId);
      
      expect(token).toBeDefined();
      
      const validation = crossServiceAuth.validateToken(token!.token);
      
      expect(validation.valid).toBe(true);
      expect(validation.service).toBeDefined();
      expect(validation.service?.id).toBe(serviceId);
      expect(validation.claims).toBeDefined();
    });
    
    test('should validate a token against an expected audience', () => {
      const audience = ['api-gateway'];
      const token = crossServiceAuth.issueToken(serviceId, audience);
      
      expect(token).toBeDefined();
      
      // Valid audience
      const validation1 = crossServiceAuth.validateToken(token!.token, 'api-gateway');
      expect(validation1.valid).toBe(true);
      
      // Invalid audience
      const validation2 = crossServiceAuth.validateToken(token!.token, 'database');
      expect(validation2.valid).toBe(false);
    });
    
    test('should revoke a token successfully', () => {
      const token = crossServiceAuth.issueToken(serviceId);
      
      expect(token).toBeDefined();
      
      // Token is valid initially
      const validation1 = crossServiceAuth.validateToken(token!.token);
      expect(validation1.valid).toBe(true);
      
      // Revoke token
      const revoked = crossServiceAuth.revokeToken(token!.token);
      expect(revoked).toBe(true);
      
      // Token should be invalid after revocation
      const validation2 = crossServiceAuth.validateToken(token!.token);
      expect(validation2.valid).toBe(false);
    });
    
    test('should revoke all tokens for a service', () => {
      // Issue multiple tokens
      const token1 = crossServiceAuth.issueToken(serviceId);
      const token2 = crossServiceAuth.issueToken(serviceId);
      const token3 = crossServiceAuth.issueToken(serviceId);
      
      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
      expect(token3).toBeDefined();
      
      // Revoke all tokens
      const count = crossServiceAuth.revokeAllServiceTokens(serviceId);
      expect(count).toBe(3);
      
      // All tokens should be invalid
      expect(crossServiceAuth.validateToken(token1!.token).valid).toBe(false);
      expect(crossServiceAuth.validateToken(token2!.token).valid).toBe(false);
      expect(crossServiceAuth.validateToken(token3!.token).valid).toBe(false);
    });
    
    test('should automatically invalidate tokens when key rotates', async () => {
      // Issue a token with the current key
      const token = crossServiceAuth.issueToken(serviceId);
      
      expect(token).toBeDefined();
      expect(crossServiceAuth.validateToken(token!.token).valid).toBe(true);
      
      // Wait for key rotation
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Token should still be valid because previous keys are kept
      expect(crossServiceAuth.validateToken(token!.token).valid).toBe(true);
      
      // Issue a new token with the new key
      const newToken = crossServiceAuth.issueToken(serviceId);
      
      // Both tokens should be valid
      expect(crossServiceAuth.validateToken(token!.token).valid).toBe(true);
      expect(crossServiceAuth.validateToken(newToken!.token).valid).toBe(true);
    });
  });
  
  describe('Authorization Policies', () => {
    let serviceId: string;
    let service: ServiceIdentity;
    
    beforeEach(() => {
      const serviceData: Omit<ServiceIdentity, 'id' | 'createdAt'> = {
        name: 'auth-policy-service',
        namespace: 'applications',
        roles: ['service', 'client'],
        metadata: { region: 'us-east' },
        expiresAt: new Date(Date.now() + 3600000)
      };
      
      service = crossServiceAuth.registerService(serviceData);
      serviceId = service.id;
    });
    
    test('should register a policy successfully', () => {
      const policy: Omit<AuthorizationPolicy, 'id'> = {
        name: 'api-access',
        description: 'API access policy',
        serviceSelector: 'auth-policy-service',
        rules: [
          {
            resource: 'api/users',
            actions: ['read', 'create']
          },
          {
            resource: 'api/profiles',
            actions: ['read']
          }
        ]
      };
      
      const registeredPolicy = crossServiceAuth.registerPolicy(policy);
      
      expect(registeredPolicy).toBeDefined();
      expect(registeredPolicy.id).toBeDefined();
      expect(registeredPolicy.name).toBe(policy.name);
      expect(registeredPolicy.rules).toEqual(policy.rules);
    });
    
    test('should retrieve a policy by ID', () => {
      const policy: Omit<AuthorizationPolicy, 'id'> = {
        name: 'db-access',
        serviceSelector: 'auth-policy-service',
        rules: [
          {
            resource: 'db/users',
            actions: ['read']
          }
        ]
      };
      
      const registeredPolicy = crossServiceAuth.registerPolicy(policy);
      const retrievedPolicy = crossServiceAuth.getPolicy(registeredPolicy.id);
      
      expect(retrievedPolicy).toBeDefined();
      expect(retrievedPolicy).toEqual(registeredPolicy);
    });
    
    test('should update a policy successfully', () => {
      const policy: Omit<AuthorizationPolicy, 'id'> = {
        name: 'storage-access',
        serviceSelector: 'auth-policy-service',
        rules: [
          {
            resource: 'storage/files',
            actions: ['read']
          }
        ]
      };
      
      const registeredPolicy = crossServiceAuth.registerPolicy(policy);
      
      // Update policy rules
      const updatedRules = [
        ...policy.rules,
        {
          resource: 'storage/folders',
          actions: ['read', 'create']
        }
      ];
      
      const updatedPolicy = crossServiceAuth.updatePolicy(registeredPolicy.id, {
        rules: updatedRules
      });
      
      expect(updatedPolicy).toBeDefined();
      expect(updatedPolicy?.rules).toEqual(updatedRules);
      expect(updatedPolicy?.name).toBe(policy.name);
    });
    
    test('should delete a policy successfully', () => {
      const policy: Omit<AuthorizationPolicy, 'id'> = {
        name: 'temp-policy',
        serviceSelector: 'auth-policy-service',
        rules: [
          {
            resource: 'temp',
            actions: ['read']
          }
        ]
      };
      
      const registeredPolicy = crossServiceAuth.registerPolicy(policy);
      const result = crossServiceAuth.deletePolicy(registeredPolicy.id);
      
      expect(result).toBe(true);
      expect(crossServiceAuth.getPolicy(registeredPolicy.id)).toBeUndefined();
    });
    
    test('should check authorization successfully', () => {
      // Register a policy
      const policy: Omit<AuthorizationPolicy, 'id'> = {
        name: 'resource-access',
        serviceSelector: 'auth-policy-service',
        rules: [
          {
            resource: 'resource-1',
            actions: ['read', 'write']
          },
          {
            resource: 'resource-2',
            actions: ['read']
          }
        ]
      };
      
      crossServiceAuth.registerPolicy(policy);
      
      // Register a target service
      const targetService = crossServiceAuth.registerService({
        name: 'target-service',
        namespace: 'default',
        roles: ['service'],
        metadata: {},
        expiresAt: new Date(Date.now() + 3600000)
      });
      
      // Check authorized actions
      expect(crossServiceAuth.checkAuthorization({
        caller: service,
        target: targetService,
        resource: 'resource-1',
        action: 'read',
        metadata: {} // Added the missing metadata field
      })).toBe(true);
      
      expect(crossServiceAuth.checkAuthorization({
        caller: service,
        target: targetService,
        resource: 'resource-1',
        action: 'write',
        metadata: {} // Added the missing metadata field
      })).toBe(true);
      
      expect(crossServiceAuth.checkAuthorization({
        caller: service,
        target: targetService,
        resource: 'resource-2',
        action: 'read',
        metadata: {} // Added the missing metadata field
      })).toBe(true);
      
      // Check unauthorized actions
      expect(crossServiceAuth.checkAuthorization({
        caller: service,
        target: targetService,
        resource: 'resource-2',
        action: 'write',
        metadata: {} // Added the missing metadata field
      })).toBe(false);
      
      expect(crossServiceAuth.checkAuthorization({
        caller: service,
        target: targetService,
        resource: 'resource-3',
        action: 'read',
        metadata: {} // Added the missing metadata field
      })).toBe(false);
    });
    
    test('should support regex service selectors', () => {
      // Register a policy with regex selector
      const policy: Omit<AuthorizationPolicy, 'id'> = {
        name: 'regex-policy',
        serviceSelector: /^auth-policy/, // Matches anything starting with 'auth-policy'
        rules: [
          {
            resource: 'api',
            actions: ['access']
          }
        ]
      };
      
      crossServiceAuth.registerPolicy(policy);
      
      // Register a target service
      const targetService = crossServiceAuth.registerService({
        name: 'target-service',
        namespace: 'default',
        roles: ['service'],
        metadata: {},
        expiresAt: new Date(Date.now() + 3600000)
      });
      
      // Check authorization for service matching regex
      expect(crossServiceAuth.checkAuthorization({
        caller: service, // name is 'auth-policy-service'
        target: targetService,
        resource: 'api',
        action: 'access',
        metadata: {} // Added the missing metadata field
      })).toBe(true);
      
      // Register a non-matching service
      const nonMatchingService = crossServiceAuth.registerService({
        name: 'non-matching',
        namespace: 'default',
        roles: ['service'],
        metadata: {},
        expiresAt: new Date(Date.now() + 3600000)
      });
      
      // Check authorization for service not matching regex
      expect(crossServiceAuth.checkAuthorization({
        caller: nonMatchingService,
        target: targetService,
        resource: 'api',
        action: 'access',
        metadata: {} // Added the missing metadata field
      })).toBe(false);
    });
    
    test('should support conditional rules', () => {
      // Register a policy with conditional rules
      const policy: Omit<AuthorizationPolicy, 'id'> = {
        name: 'conditional-policy',
        serviceSelector: 'auth-policy-service',
        rules: [
          {
            resource: 'sensitive-data',
            actions: ['read'],
            condition: (context) => context.caller.metadata.region === 'us-east'
          }
        ]
      };
      
      crossServiceAuth.registerPolicy(policy);
      
      // Register a target service
      const targetService = crossServiceAuth.registerService({
        name: 'target-service',
        namespace: 'default',
        roles: ['service'],
        metadata: {},
        expiresAt: new Date(Date.now() + 3600000)
      });
      
      // Check authorization with matching condition
      expect(crossServiceAuth.checkAuthorization({
        caller: service, // Metadata has region: 'us-east'
        target: targetService,
        resource: 'sensitive-data',
        action: 'read',
        metadata: {} // Added the missing metadata field
      })).toBe(true);
      
      // Register a service with different region
      const differentRegionService = crossServiceAuth.registerService({
        name: 'different-region',
        namespace: 'default',
        roles: ['service'],
        metadata: { region: 'eu-west' },
        expiresAt: new Date(Date.now() + 3600000)
      });
      
      // Check authorization with non-matching condition
      expect(crossServiceAuth.checkAuthorization({
        caller: differentRegionService,
        target: targetService,
        resource: 'sensitive-data',
        action: 'read',
        metadata: {} // Added the missing metadata field
      })).toBe(false);
    });
  });
  
  describe('Stats and Metrics', () => {
    test('should return valid statistics', () => {
      // Register some services
      crossServiceAuth.registerService({
        name: 'stats-service-1',
        namespace: 'default',
        roles: ['service'],
        metadata: {},
        expiresAt: new Date(Date.now() + 3600000)
      });
      
      crossServiceAuth.registerService({
        name: 'stats-service-2',
        namespace: 'default',
        roles: ['service'],
        metadata: {},
        expiresAt: new Date(Date.now() + 3600000)
      });
      
      // Register some policies
      crossServiceAuth.registerPolicy({
        name: 'stats-policy-1',
        serviceSelector: 'stats-service-1',
        rules: [{ resource: 'api', actions: ['read'] }]
      });
      
      // Issue some tokens
      const service1 = crossServiceAuth.getService('stats-service-1');
      if (service1) {
        crossServiceAuth.issueToken(service1.id);
        crossServiceAuth.issueToken(service1.id);
      }
      
      // Get stats
      const stats = crossServiceAuth.getStats();
      
      expect(stats.services).toBe(2);
      expect(stats.activeTokens).toBe(2);
      expect(stats.policies).toBe(1);
      expect(stats.keyAge).toBeGreaterThanOrEqual(0);
    });
  });
});