import axios from 'axios';

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

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  firstName: string;
  lastName: string;
}

class AuthService {
  private readonly baseUrl = '/auth';

  async login(data: LoginData): Promise<{ data: AuthResponse }> {
    return axios.post(`${this.baseUrl}/login`, data);
  }

  async register(data: RegisterData): Promise<{ data: AuthResponse }> {
    return axios.post(`${this.baseUrl}/register`, data);
  }

  async logout(): Promise<{ data: { success: boolean } }> {
    return axios.post(`${this.baseUrl}/logout`);
  }

  async refreshToken(refreshToken: string): Promise<{ data: { tokens: AuthTokens } }> {
    return axios.post(`${this.baseUrl}/refresh`, { refreshToken });
  }
}

export const authService = new AuthService();