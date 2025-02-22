import axios from 'axios';
import { User, AuthTokens } from '../../types/auth';

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}

class AuthService {
    private readonly baseUrl = '/auth';

    async login(data: LoginData): Promise<{ data: AuthResponse }> {
        return axios.post(`${this.baseUrl}/login`, data);
    }

    async register(data: RegisterData): Promise<{ data: AuthResponse }> {
        return axios.post(`${this.baseUrl}/register`, data);
    }

    async logout(): Promise<void> {
        await axios.post(`${this.baseUrl}/logout`);
    }

    async refreshToken(refreshToken: string): Promise<{ data: { tokens: AuthTokens } }> {
        return axios.post(`${this.baseUrl}/refresh`, { refreshToken });
    }

    async validateToken(token: string): Promise<{ data: { valid: boolean } }> {
        return axios.post(`${this.baseUrl}/validate`, { token });
    }
}

export const authService = new AuthService();