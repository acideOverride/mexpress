import { authService } from './auth.service';
import axios from 'axios';

jest.mock('axios');
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
});