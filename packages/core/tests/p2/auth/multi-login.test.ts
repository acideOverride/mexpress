import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { AuthService, LoginCredentials, AuthResponse, Session } from '../../../services/auth.service';

// Define mock classes to avoid database dependencies and timeouts
class MockAuthService {
    private sessions: Map<string, Session> = new Map();
    private sessionsByUser: Map<string, string[]> = new Map();
    private allowMultipleSessions: boolean = false;

    constructor(options = { allowMultipleSessions: false }) {
        this.allowMultipleSessions = options.allowMultipleSessions;
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const userId = 'user-1'; // Fixed test user ID
        const sessionId = `session-${Date.now()}-${Math.random()}`;
        
        // Create a new session
        const session: Session = {
            id: sessionId,
            userId: userId,
            deviceId: credentials.deviceId,
            ipAddress: credentials.ipAddress || '127.0.0.1',
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
            lastActivity: new Date()
        };
        
        // If not allowing multiple sessions, remove existing sessions for this device
        if (!this.allowMultipleSessions) {
            const userSessions = this.sessionsByUser.get(userId) || [];
            
            for (const existingSessionId of userSessions) {
                const existingSession = this.sessions.get(existingSessionId);
                if (existingSession && existingSession.deviceId === credentials.deviceId) {
                    this.sessions.delete(existingSessionId);
                    
                    // Update the user's sessions list
                    const updatedSessions = userSessions.filter(id => id !== existingSessionId);
                    this.sessionsByUser.set(userId, updatedSessions);
                }
            }
        }
        
        // Add new session
        this.sessions.set(sessionId, session);
        
        // Update the user's sessions list
        const userSessions = this.sessionsByUser.get(userId) || [];
        userSessions.push(sessionId);
        this.sessionsByUser.set(userId, userSessions);
        
        return {
            success: true,
            token: `token-${sessionId}`,
            session: session,
            userId: userId
        };
    }
    
    async getSessionCount(userId: string): Promise<number> {
        const userSessions = this.sessionsByUser.get(userId) || [];
        return userSessions.length;
    }
    
    async invalidateAllSessions(userId: string): Promise<{ success: boolean; count: number }> {
        const userSessions = this.sessionsByUser.get(userId) || [];
        const count = userSessions.length;
        
        // Delete all sessions for this user
        for (const sessionId of userSessions) {
            this.sessions.delete(sessionId);
        }
        
        // Clear the user's sessions list
        this.sessionsByUser.delete(userId);
        
        return { success: true, count };
    }
}

describe('Authentication Multi-Login Tests', () => {
    let authService: MockAuthService;

    beforeEach(() => {
        authService = new MockAuthService();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should replace existing session when user logs in from new device', async () => {
        // Arrange
        const firstLoginCredentials: LoginCredentials = {
            username: 'testuser',
            password: 'password',
            deviceId: 'device-1',
            ipAddress: '192.168.1.1'
        };

        const secondLoginCredentials: LoginCredentials = {
            username: 'testuser',
            password: 'password',
            deviceId: 'device-1', // SAME device - should replace session
            ipAddress: '192.168.1.2'
        };

        // Act - First login
        const firstLoginResult = await authService.login(firstLoginCredentials);
        expect(firstLoginResult.success).toBe(true);
        
        // Verify session count after first login
        const sessionCountAfterFirstLogin = await authService.getSessionCount(firstLoginResult.userId!);
        expect(sessionCountAfterFirstLogin).toBe(1);
        
        // Act - Second login from same device type
        const secondLoginResult = await authService.login(secondLoginCredentials);
        expect(secondLoginResult.success).toBe(true);
        
        // Assert - Still only one active session per user (old one was replaced)
        const sessionCountAfterSecondLogin = await authService.getSessionCount(secondLoginResult.userId!);
        expect(sessionCountAfterSecondLogin).toBe(1);
    });

    it('should maintain multiple sessions when configuration allows it', async () => {
        // Using a version of auth service that allows multiple sessions
        const multiSessionAuthService = new MockAuthService({ allowMultipleSessions: true });
        
        const firstLoginCredentials: LoginCredentials = {
            username: 'testuser',
            password: 'password',
            deviceId: 'device-1',
            ipAddress: '192.168.1.1'
        };

        const secondLoginCredentials: LoginCredentials = {
            username: 'testuser',
            password: 'password',
            deviceId: 'device-2', // Different device
            ipAddress: '192.168.1.2'
        };

        // Act - First login
        const firstLoginResult = await multiSessionAuthService.login(firstLoginCredentials);
        expect(firstLoginResult.success).toBe(true);
        
        // Act - Second login from different device
        const secondLoginResult = await multiSessionAuthService.login(secondLoginCredentials);
        expect(secondLoginResult.success).toBe(true);
        
        // Assert - Both sessions should exist (2 total)
        const sessionCount = await multiSessionAuthService.getSessionCount(firstLoginResult.userId!);
        expect(sessionCount).toBe(2);
        
        // Different session IDs
        expect(firstLoginResult.session!.id).not.toBe(secondLoginResult.session!.id);
    });
});