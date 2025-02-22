import jwt from 'jsonwebtoken';
import { UserModel, UserDocument } from '../models/user.schema';
import { CreateUserDto, LoginCredentials, AuthTokens, User } from '../models/user';
import crypto from 'crypto';

export class AuthError extends Error {
    constructor(message: string, public code: 'INVALID_CREDENTIALS' | 'USER_NOT_FOUND' | 'INVALID_TOKEN' | 'TOKEN_EXPIRED' | 'VALIDATION_ERROR') {
        super(message);
        this.name = 'AuthError';
    }
}

export class AuthService {
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
    private readonly TOKEN_EXPIRY = '15m';
    private readonly REFRESH_TOKEN_EXPIRY = '7d';

    async register(dto: CreateUserDto): Promise<User> {
        try {
            const user = new UserModel(dto);
            await user.save();

            // Don't return password and refresh token
            const { password, refreshToken, ...userWithoutSensitiveData } = user.toObject();
            return userWithoutSensitiveData;
        } catch (error: any) {
            if (error.code === 11000) {
                throw new AuthError('Email already exists', 'VALIDATION_ERROR');
            }
            throw error;
        }
    }

    async login(credentials: LoginCredentials): Promise<AuthTokens & { user: User }> {
        const user = await UserModel.findOne({ email: credentials.email }).select('+password');
        if (!user) {
            throw new AuthError('Invalid credentials', 'INVALID_CREDENTIALS');
        }

        const isValidPassword = await user.comparePassword(credentials.password);
        if (!isValidPassword) {
            throw new AuthError('Invalid credentials', 'INVALID_CREDENTIALS');
        }

        // Generate tokens
        const tokens = await this.generateTokens(user);

        // Update user's refresh token and last login
        user.refreshToken = tokens.refreshToken;
        user.lastLogin = new Date();
        await user.save();

        // Don't return password and refresh token in user object
        const { password, refreshToken, ...userWithoutSensitiveData } = user.toObject();

        return {
            ...tokens,
            user: userWithoutSensitiveData
        };
    }

    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        try {
            // Verify refresh token
            const payload = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as { sub: string };
            
            // Find user by id and refresh token
            const user = await UserModel.findOne({
                _id: payload.sub,
                refreshToken: refreshToken
            });

            if (!user) {
                throw new AuthError('Invalid refresh token', 'INVALID_TOKEN');
            }

            // Generate new tokens
            const tokens = await this.generateTokens(user);

            // Update user's refresh token
            user.refreshToken = tokens.refreshToken;
            await user.save();

            return tokens;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new AuthError('Refresh token expired', 'TOKEN_EXPIRED');
            }
            throw new AuthError('Invalid refresh token', 'INVALID_TOKEN');
        }
    }

    async logout(userId: string): Promise<void> {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new AuthError('User not found', 'USER_NOT_FOUND');
        }

        // Clear refresh token
        user.refreshToken = undefined;
        await user.save();
    }

    async validateToken(token: string): Promise<{ valid: boolean; userId?: string; error?: string }> {
        try {
            const payload = jwt.verify(token, this.JWT_SECRET) as { sub: string };
            return { valid: true, userId: payload.sub };
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return { valid: false, error: 'Token expired' };
            }
            return { valid: false, error: 'Invalid token' };
        }
    }

    private async generateTokens(user: UserDocument): Promise<AuthTokens> {
        const payload = { sub: user.id };

        const [token, refreshToken] = await Promise.all([
            jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.TOKEN_EXPIRY }),
            jwt.sign(payload, this.JWT_REFRESH_SECRET, { expiresIn: this.REFRESH_TOKEN_EXPIRY })
        ]);

        return { token, refreshToken };
    }

    private generateRefreshToken(): string {
        return crypto.randomBytes(40).toString('hex');
    }
}