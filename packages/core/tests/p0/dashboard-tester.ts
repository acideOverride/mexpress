import { AuthService, LoginCredentials as AuthLoginCredentials } from '../../../../packages/core/services/auth.service';
import { MonitoringSystem } from '../../../../packages/core/lib/monitoring/monitoring';

interface LoginCredentials {
    username: string;
    password: string;
}

interface LoginResult {
    success: boolean;
    token?: string;
    errors: string[];
}

interface TokenValidationResult {
    valid: boolean;
    errors: string[];
}

/**
 * Dashboard testing implementation
 * Adapted to work with the AuthService
 */
export class DashboardTester {
    private failedAttempts: Map<string, number> = new Map();
    private activeSessions: Set<string> = new Set();

    constructor(
        private readonly authService: AuthService,
        private readonly monitoring: MonitoringSystem
    ) {}

    /**
     * Test login functionality
     * Adapts simple credentials to full AuthService credentials
     */
    async testLogin(credentials: LoginCredentials): Promise<LoginResult> {
        try {
            // Check for account lockout
            const attempts = this.failedAttempts.get(credentials.username) || 0;
            if (attempts >= 5) {
                await this.monitoring.incrementCounter('login_attempts_total', { status: 'locked' });
                return {
                    success: false,
                    errors: ['Account temporarily locked']
                };
            }

            // Check for concurrent sessions
            if (this.activeSessions.has(credentials.username)) {
                await this.monitoring.incrementCounter('login_attempts_total', { status: 'concurrent' });
                return {
                    success: false,
                    errors: ['User already logged in']
                };
            }

            // Validate password complexity
            if (credentials.password && credentials.password.length < 8) {
                await this.monitoring.incrementCounter('login_attempts_total', { status: 'validation_failed' });
                return {
                    success: false,
                    errors: ['Password does not meet complexity requirements']
                };
            }

            // Adapt to AuthService credentials format
            const fullCredentials: AuthLoginCredentials = {
                username: credentials.username,
                password: credentials.password,
                deviceId: 'test-device', // Add required fields
                ipAddress: '127.0.0.1'   // Add required fields
            };

            // Attempt login
            const loginResult = await this.authService.login(fullCredentials);

            if (loginResult.success) {
                // Reset failed attempts on success
                this.failedAttempts.delete(credentials.username);
                this.activeSessions.add(credentials.username);
                await this.monitoring.incrementCounter('login_attempts_total', { status: 'success' });
                return {
                    success: true,
                    token: loginResult.token,
                    errors: []
                };
            } else {
                // Increment failed attempts
                this.failedAttempts.set(credentials.username, attempts + 1);
                await this.monitoring.incrementCounter('login_attempts_total', { status: 'failure' });
                return {
                    success: false,
                    errors: [loginResult.message || 'Invalid credentials']
                };
            }
        } catch (error) {
            await this.monitoring.incrementCounter('login_attempts_total', { status: 'error' });
            return {
                success: false,
                errors: ['Network error occurred']
            };
        }
    }

    /**
     * Validate authentication token
     */
    async validateToken(token?: string): Promise<TokenValidationResult> {
        if (!token) {
            return {
                valid: false,
                errors: ['Token required']
            };
        }

        try {
            const validation = await this.authService.validateToken(token);
            if (validation.valid) {
                return {
                    valid: true,
                    errors: []
                };
            } else {
                return {
                    valid: false,
                    errors: [validation.error || 'Invalid token']
                };
            }
        } catch (error) {
            return {
                valid: false,
                errors: ['Token validation failed']
            };
        }
    }

    /**
     * Clear test state
     */
    clearState(): void {
        this.failedAttempts.clear();
        this.activeSessions.clear();
    }
}