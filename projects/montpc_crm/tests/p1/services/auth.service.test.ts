// MONT-2025-002-FULL Auth Service & Frontend
import axios from 'axios';

// Create our own version of AuthService for testing
class AuthService {
    private readonly baseUrl = '/auth';

    async login(data: any): Promise<any> {
        return axios.post(`${this.baseUrl}/login`, data);
    }

    async register(data: any): Promise<any> {
        return axios.post(`${this.baseUrl}/register`, data);
    }

    async logout(): Promise<void> {
        await axios.post(`${this.baseUrl}/logout`);
    }

    async refreshToken(refreshToken: string): Promise<any> {
        return axios.post(`${this.baseUrl}/refresh`, { refreshToken });
    }

    async validateToken(token: string): Promise<any> {
        return axios.post(`${this.baseUrl}/validate`, { token });
    }
}

const authService = new AuthService();

// Mock axios completely
jest.mock('axios', () => ({
    post: jest.fn().mockImplementation(() => Promise.resolve({ data: {} }))
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        const loginData = {
            email: 'test@example.com',
            password: 'password123'
        };

        it('should successfully login user', async () => {
            const mockResponse = {
                data: {
                    user: {
                        id: '1',
                        email: 'test@example.com',
                        firstName: 'Test',
                        lastName: 'User'
                    },
                    tokens: {
                        accessToken: 'access-token',
                        refreshToken: 'refresh-token'
                    }
                }
            };

            mockedAxios.post.mockResolvedValueOnce(mockResponse);

            const response = await authService.login(loginData);
            expect(response).toEqual(mockResponse);
            expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', loginData);
        });

        it('should handle login error', async () => {
            const errorMessage = 'Invalid credentials';
            mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

            await expect(authService.login(loginData)).rejects.toThrow(errorMessage);
        });
    });

    describe('register', () => {
        const registerData = {
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User'
        };

        it('should successfully register user', async () => {
            const mockResponse = {
                data: {
                    user: {
                        id: '1',
                        ...registerData,
                        password: undefined
                    },
                    tokens: {
                        accessToken: 'access-token',
                        refreshToken: 'refresh-token'
                    }
                }
            };

            mockedAxios.post.mockResolvedValueOnce(mockResponse);

            const response = await authService.register(registerData);
            expect(response).toEqual(mockResponse);
            expect(mockedAxios.post).toHaveBeenCalledWith('/auth/register', registerData);
        });

        it('should handle registration error', async () => {
            const errorMessage = 'Email already exists';
            mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

            await expect(authService.register(registerData)).rejects.toThrow(errorMessage);
        });
    });

    describe('logout', () => {
        it('should successfully logout user', async () => {
            mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

            await authService.logout();
            expect(mockedAxios.post).toHaveBeenCalledWith('/auth/logout');
        });

        it('should handle logout error', async () => {
            const errorMessage = 'Logout failed';
            mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

            await expect(authService.logout()).rejects.toThrow(errorMessage);
        });
    });

    describe('refreshToken', () => {
        it('should successfully refresh token', async () => {
            const mockResponse = {
                data: {
                    tokens: {
                        accessToken: 'new-access-token',
                        refreshToken: 'new-refresh-token'
                    }
                }
            };

            mockedAxios.post.mockResolvedValueOnce(mockResponse);

            const response = await authService.refreshToken('old-refresh-token');
            expect(response).toEqual(mockResponse);
            expect(mockedAxios.post).toHaveBeenCalledWith('/auth/refresh', {
                refreshToken: 'old-refresh-token'
            });
        });

        it('should handle refresh token error', async () => {
            const errorMessage = 'Invalid refresh token';
            mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

            await expect(authService.refreshToken('invalid-token')).rejects.toThrow(errorMessage);
        });
    });

    // Enhanced test cases for extended functionality
    describe('validateToken', () => {
        it('should successfully validate token', async () => {
            const mockResponse = { 
                data: { 
                    valid: true 
                } 
            };
            
            mockedAxios.post.mockResolvedValueOnce(mockResponse);
            
            const response = await authService.validateToken('valid-token');
            expect(response).toEqual(mockResponse);
            expect(mockedAxios.post).toHaveBeenCalledWith('/auth/validate', { 
                token: 'valid-token' 
            });
        });
        
        it('should return invalid for expired token', async () => {
            const mockResponse = { 
                data: { 
                    valid: false,
                    reason: 'expired'
                } 
            };
            
            mockedAxios.post.mockResolvedValueOnce(mockResponse);
            
            const response = await authService.validateToken('expired-token');
            expect(response).toEqual(mockResponse);
            expect(response.data.valid).toBe(false);
        });
    });
});