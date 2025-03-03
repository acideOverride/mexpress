import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { DashboardTester } from '../dashboard-tester';
import { AuthService } from '../../../../../packages/core/services/auth.service';
import { MonitoringSystem } from '../../../../../packages/core/lib/monitoring/monitoring';

// BRQ: MEXP-2025-002-BE - Authentication & Security
// Increase timeout for all tests in this file
jest.setTimeout(60000);

describe('Dashboard Login Testing', () => {
    let dashboardTester: DashboardTester;
    let authService: AuthService;
    let monitoring: MonitoringSystem;

    beforeEach(() => {
        authService = new AuthService();
        monitoring = new MonitoringSystem();
        dashboardTester = new DashboardTester(authService, monitoring);
    });

    afterEach(() => {
        jest.restoreAllMocks();
        dashboardTester.clearState();
    });

    describe('login functionality', () => {
        it('should successfully login with valid credentials', async () => {
            // Arrange
            const credentials = {
                username: 'test@example.com',
                password: 'validPassword123'
            };
            
            // Act
            const result = await dashboardTester.testLogin(credentials);

            // Assert
            expect(result.success).toBe(true);
            expect(result.token).toBeDefined();
            expect(result.errors).toHaveLength(0);
        });

        it('should fail login with invalid credentials', async () => {
            // Arrange
            const credentials = {
                username: 'test@example.com',
                password: 'wrongPassword123'  // Valid format but wrong password
            };
            
            // Act
            const result = await dashboardTester.testLogin(credentials);

            // Assert
            expect(result.success).toBe(false);
            expect(result.token).toBeUndefined();
            expect(result.errors).toContain('Invalid credentials');
        });

        it('should handle network errors during login', async () => {
            // Arrange
            jest.spyOn(authService, 'login').mockRejectedValue(new Error('Network error'));
            const credentials = {
                username: 'test@example.com',
                password: 'validPassword123'
            };
            
            // Act
            const result = await dashboardTester.testLogin(credentials);

            // Assert
            expect(result.success).toBe(false);
            expect(result.errors).toContain('Network error occurred');
        });

        it('should record metrics for successful login', async () => {
            // Arrange
            const metricsspy = jest.spyOn(monitoring, 'incrementCounter');
            const credentials = {
                username: 'test@example.com',
                password: 'validPassword123'
            };
            
            // Act
            await dashboardTester.testLogin(credentials);

            // Assert
            expect(metricsspy).toHaveBeenCalledWith('login_attempts_total', { status: 'success' });
        });

        it('should record metrics for failed login', async () => {
            // Arrange
            const metricsspy = jest.spyOn(monitoring, 'incrementCounter');
            const credentials = {
                username: 'test@example.com',
                password: 'wrongPassword123'  // Valid format but wrong password
            };
            
            // Act
            await dashboardTester.testLogin(credentials);

            // Assert
            expect(metricsspy).toHaveBeenCalledWith('login_attempts_total', { status: 'failure' });
        });
    });

    describe('authentication validation', () => {
        it('should validate token after successful login', async () => {
            // Arrange
            const credentials = {
                username: 'test@example.com',
                password: 'validPassword123'
            };
            
            // Act
            const loginResult = await dashboardTester.testLogin(credentials);
            const validationResult = await dashboardTester.validateToken(loginResult.token);

            // Assert
            expect(validationResult.valid).toBe(true);
            expect(validationResult.errors).toHaveLength(0);
        });

        it('should reject invalid token', async () => {
            // Arrange
            const invalidToken = 'invalid-token';
            
            // Act
            const result = await dashboardTester.validateToken(invalidToken);

            // Assert
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Invalid token');
        });

        it('should handle expired token', async () => {
            // Arrange
            const expiredToken = 'expired-token';
            jest.spyOn(authService, 'validateToken').mockResolvedValue({
                valid: false,
                error: 'Token expired'
            });
            
            // Act
            const result = await dashboardTester.validateToken(expiredToken);

            // Assert
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Token expired');
        });
    });

    describe('security validation', () => {
        it('should block login after too many failed attempts', async () => {
            // Arrange
            const credentials = {
                username: 'test@example.com',
                password: 'wrongPassword123'  // Valid format but wrong password
            };
            
            // Act
            for (let i = 0; i < 5; i++) {
                await dashboardTester.testLogin(credentials);
            }
            const result = await dashboardTester.testLogin(credentials);

            // Assert
            expect(result.success).toBe(false);
            expect(result.errors).toContain('Account temporarily locked');
        });

        it('should validate password complexity', async () => {
            // Arrange
            const credentials = {
                username: 'test@example.com',
                password: 'weak'  // Invalid password format
            };
            
            // Act
            const result = await dashboardTester.testLogin(credentials);

            // Assert
            expect(result.success).toBe(false);
            expect(result.errors).toContain('Password does not meet complexity requirements');
        });

        it('should prevent concurrent login sessions', async () => {
            // Arrange
            const credentials = {
                username: 'test@example.com',
                password: 'validPassword123'
            };
            
            // Act
            const firstLogin = await dashboardTester.testLogin(credentials);
            const secondLogin = await dashboardTester.testLogin(credentials);

            // Assert
            expect(firstLogin.success).toBe(true);
            expect(secondLogin.success).toBe(false);
            expect(secondLogin.errors).toContain('User already logged in');
        });
    });
});