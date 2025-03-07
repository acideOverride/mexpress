import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Types needed for the test
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  firstName: string;
  lastName: string;
}

// Simple implementation of the auth service for testing
class AuthService {
  async login(data: LoginData) {
    return axios.post('/auth/login', data);
  }

  async register(data: RegisterData) {
    return axios.post('/auth/register', data);
  }

  async logout() {
    return axios.post('/auth/logout');
  }

  async refreshToken(refreshToken: string) {
    return axios.post('/auth/refresh', { refreshToken });
  }

  async validateToken(token: string) {
    return axios.post('/auth/validate', { token });
  }
}

const authService = new AuthService();

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
            email: registerData.email,
            firstName: registerData.firstName,
            lastName: registerData.lastName
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
      const mockResponse = { data: { success: true } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.logout();
      
      expect(result).toEqual(mockResponse);
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

    it('should handle invalid token', async () => {
      const mockResponse = {
        data: {
          valid: false
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const response = await authService.validateToken('invalid-token');
      
      expect(response).toEqual(mockResponse);
      expect(response.data.valid).toBe(false);
    });

    it('should handle validation error', async () => {
      const errorMessage = 'Validation failed';
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(authService.validateToken('invalid-token')).rejects.toThrow(errorMessage);
    });
  });
});