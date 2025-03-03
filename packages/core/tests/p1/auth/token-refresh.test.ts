import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { AuthService, LoginCredentials } from '../../../../../packages/core/services/auth.service';

// BRQ: MEXP-2025-002-BE - Authentication & Security

describe('Auth Token Refresh Tests', () => {
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should refresh token within 200ms time limit', async () => {
        // Arrange
        const credentials: LoginCredentials = {
            username: 'testuser',
            password: 'password',
            deviceId: 'device-1',
            ipAddress: '192.168.1.1'
        };
        
        // First login to get initial token
        const loginResult = await authService.login(credentials);
        expect(loginResult.success).toBe(true);
        expect(loginResult.token).toBeDefined();
        
        const sessionId = loginResult.session!.id;
        
        // Act - Measure token refresh time
        const startTime = Date.now();
        
        const refreshResult = await authService.refreshToken(sessionId);
        
        const endTime = Date.now();
        const refreshDuration = endTime - startTime;
        
        // Assert - Token refresh should be quick (less than 200ms)
        expect(refreshDuration).toBeLessThan(200);
        expect(refreshResult.success).toBe(true);
        expect(refreshResult.token).toBeDefined();
        expect(refreshResult.token).not.toBe(loginResult.token);
    });
});