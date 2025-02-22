export interface User {
    id: string;
    email: string;
    password?: string; // Optional in responses
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    refreshToken?: string;
    lastLogin?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserDto {
    email: string;
    password: string; // Required for creation
    firstName: string;
    lastName: string;
    role?: 'user' | 'admin';
}

export interface UpdateUserDto {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: 'user' | 'admin';
    isActive?: boolean;
}

export interface AuthTokens {
    token: string;
    refreshToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

// Response types
export interface AuthResponse {
    user: Omit<User, 'password' | 'refreshToken'>;
    tokens: AuthTokens;
}

export interface UserResponse extends Omit<User, 'password' | 'refreshToken'> {}