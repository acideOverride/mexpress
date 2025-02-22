import { rest } from 'msw';
import { server } from '../../../setupTests';
import { authService } from '../auth.service';
import { LoginCredentials, AuthTokens, UserProfile } from '../../types/auth';
import { localStorageMock } from '../../../setupTests';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe('login', () => {
    it('should login successfully and store tokens', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockTokens: AuthTokens = {
        token: 'mock-token',
        refreshToken: 'mock-refresh-token'
      };

      server.use(
        rest.post('http://localhost:3000/api/auth/login', (_req, res, ctx) => {
          return res(ctx.json({ data: mockTokens }));
        })
      );

      const response = await authService.login(credentials);

      expect(response.data).toEqual(mockTokens);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', mockTokens.token);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refresh_token', mockTokens.refreshToken);
    });

    it('should handle invalid credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'wrong@example.com',
        password: 'wrongpass'
      };

      server.use(
        rest.post('http://localhost:3000/api/auth/login', (_req, res, ctx) => {
          return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }));
        })
      );

      await expect(authService.login(credentials)).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should clear stored tokens and call logout endpoint', async () => {
      server.use(
        rest.post('http://localhost:3000/api/auth/logout', (_req, res, ctx) => {
          return res(ctx.status(200));
        })
      );

      await authService.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockNewTokens: AuthTokens = {
        token: 'new-token',
        refreshToken: 'new-refresh-token'
      };

      server.use(
        rest.post('http://localhost:3000/api/auth/refresh', (_req, res, ctx) => {
          return res(ctx.json({ data: mockNewTokens }));
        })
      );

      const response = await authService.refreshToken('old-refresh-token');

      expect(response.data).toEqual(mockNewTokens);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', mockNewTokens.token);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refresh_token', mockNewTokens.refreshToken);
    });

    it('should handle invalid refresh token', async () => {
      server.use(
        rest.post('http://localhost:3000/api/auth/refresh', (_req, res, ctx) => {
          return res(ctx.status(401), ctx.json({ message: 'Invalid refresh token' }));
        })
      );

      await expect(authService.refreshToken('invalid-token')).rejects.toThrow();
    });
  });

  describe('getProfile', () => {
    it('should fetch user profile successfully', async () => {
      const mockProfile: UserProfile = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        createdAt: '2025-02-17T10:00:00Z',
        updatedAt: '2025-02-17T10:00:00Z'
      };

      server.use(
        rest.get('http://localhost:3000/api/auth/profile', (_req, res, ctx) => {
          return res(ctx.json({ data: mockProfile }));
        })
      );

      const response = await authService.getProfile();
      expect(response.data).toEqual(mockProfile);
    });

    it('should handle unauthorized profile request', async () => {
      server.use(
        rest.get('http://localhost:3000/api/auth/profile', (_req, res, ctx) => {
          return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }));
        })
      );

      await expect(authService.getProfile()).rejects.toThrow();
    });
  });
});