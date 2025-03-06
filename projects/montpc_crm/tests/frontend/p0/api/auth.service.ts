import axios from 'axios';

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

class AuthService {
    private readonly baseUrl = '/auth';

    async login(data: LoginData): Promise<{ data: { user: User; tokens: AuthTokens } }> {
        return axios.post(`${this.baseUrl}/login`, data);
    }

    async register(data: RegisterData): Promise<{ data: { user: User; tokens: AuthTokens } }> {
        return axios.post(`${this.baseUrl}/register`, data);
    }

    async logout(): Promise<{ data: { success: boolean } }> {
        return axios.post(`${this.baseUrl}/logout`);
    }

    async refreshToken(refreshToken: string): Promise<{ data: { tokens: AuthTokens } }> {
        return axios.post(`${this.baseUrl}/refresh`, { refreshToken });
    }

    async validateToken(token: string): Promise<{ data: { valid: boolean } }> {
        return axios.post(`${this.baseUrl}/validate`, { token });
    }
}

export const authService = new AuthService();