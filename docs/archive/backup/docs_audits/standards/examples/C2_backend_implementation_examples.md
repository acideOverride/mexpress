# Backend Implementation Examples

## Table of Contents
1. [Controller Examples](#1-controller-examples)
2. [Service Layer Examples](#2-service-layer-examples)
3. [Repository Pattern Examples](#3-repository-pattern-examples)
4. [Middleware Examples](#4-middleware-examples)
5. [Error Handling Examples](#5-error-handling-examples)
6. [Testing Examples](#6-testing-examples)
7. [Performance Examples](#7-performance-examples)
8. [Security Examples](#8-security-examples)

## 1. Controller Examples

### 1.1 REST Controller

```typescript
@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Query() query: FindAllUsersDto
  ): Promise<UserResponse[]> {
    try {
      return await this.userService.findAll(query);
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() data: CreateUserDto
  ): Promise<UserResponse> {
    try {
      return await this.userService.create(data);
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
```

### 1.2 GraphQL Resolver

```typescript
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async users(
    @Args() args: FindAllUsersArgs
  ): Promise<User[]> {
    return this.userService.findAll(args);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async createUser(
    @Args('data') data: CreateUserInput
  ): Promise<User> {
    return this.userService.create(data);
  }
}
```

## 2. Service Layer Examples

### 2.1 Service Implementation

```typescript
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cacheService: CacheService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async findAll(query: FindAllUsersDto): Promise<User[]> {
    const cacheKey = this.getCacheKey(query);
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const users = await this.userRepository.findAll(query);
    await this.cacheService.set(cacheKey, users);
    return users;
  }

  async create(data: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.userRepository.create(data);
    this.eventEmitter.emit('user.created', user);
    return user;
  }
}
```

## 3. Repository Pattern Examples

### 3.1 TypeORM Repository

```typescript
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>
  ) {}

  async findAll(query: FindAllUsersDto): Promise<User[]> {
    return this.repo.find({
      where: query,
      relations: ['profile', 'roles'],
      cache: true
    });
  }

  async create(data: CreateUserDto): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }
}
```

## 4. Middleware Examples

### 4.1 Authentication Middleware

```typescript
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      req.user = payload;
      next();
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
```

### 4.2 Logging Middleware

```typescript
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${duration}ms`
      );
    });

    next();
  }
}
```

## 5. Error Handling Examples

### 5.1 Custom Exceptions

```typescript
export class ValidationException extends HttpException {
  constructor(errors: string[]) {
    super(
      {
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class NotFoundException extends HttpException {
  constructor(resource: string) {
    super(
      {
        status: 'error',
        code: 'NOT_FOUND',
        message: `${resource} not found`
      },
      HttpStatus.NOT_FOUND
    );
  }
}
```

### 5.2 Exception Filter

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as any;
      message = response.message || exception.message;
      code = response.code || 'HTTP_ERROR';
    }

    this.logger.error(
      `${request.method} ${request.url} - ${status} ${message}`,
      exception instanceof Error ? exception.stack : undefined
    );

    response.status(status).json({
      status: 'error',
      code,
      message,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}
```

## 6. Testing Examples

### 6.1 Unit Testing

```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: MockType<UserRepository>;
  let cacheService: MockType<CacheService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useFactory: repositoryMockFactory
        },
        {
          provide: CacheService,
          useFactory: cacheServiceMockFactory
        }
      ]
    }).compile();

    service = module.get(UserService);
    repository = module.get(UserRepository);
    cacheService = module.get(CacheService);
  });

  describe('findAll', () => {
    it('should return cached users if available', async () => {
      const users = [{ id: 1, name: 'Test' }];
      cacheService.get.mockResolvedValue(users);

      const result = await service.findAll({});
      expect(result).toBe(users);
      expect(repository.findAll).not.toHaveBeenCalled();
    });

    it('should fetch and cache users if not cached', async () => {
      const users = [{ id: 1, name: 'Test' }];
      cacheService.get.mockResolvedValue(null);
      repository.findAll.mockResolvedValue(users);

      const result = await service.findAll({});
      expect(result).toBe(users);
      expect(cacheService.set).toHaveBeenCalledWith(
        expect.any(String),
        users
      );
    });
  });
});
```

### 6.2 E2E Testing

```typescript
describe('UserController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get auth token
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = response.body.token;
  });

  it('/GET users', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## 7. Performance Examples

### 7.1 Query Optimization

```typescript
@Injectable()
export class OptimizedUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>
  ) {}

  async findAllOptimized(query: FindAllUsersDto): Promise<User[]> {
    // Use QueryBuilder for complex queries
    return this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles')
      .where(query)
      .cache(true)
      .take(query.limit)
      .skip(query.offset)
      .orderBy('user.createdAt', 'DESC')
      .getMany();
  }

  async findWithRawQuery(): Promise<User[]> {
    // Use raw queries for better performance when needed
    return this.repo.query(`
      SELECT 
        u.id,
        u.email,
        u.name,
        JSON_AGG(r.*) as roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      GROUP BY u.id
    `);
  }
}
```

### 7.2 Caching Strategy

```typescript
@Injectable()
export class CacheService {
  constructor(
    private readonly redis: Redis,
    private readonly config: ConfigService
  ) {}

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set<T>(
    key: string,
    value: T,
    ttl: number = 3600
  ): Promise<void> {
    await this.redis.set(
      key,
      JSON.stringify(value),
      'EX',
      ttl
    );
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length) {
      await this.redis.del(...keys);
    }
  }
}
```

## 8. Security Examples

### 8.1 Rate Limiting

```typescript
@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private readonly limiter: RateLimiterRedis;

  constructor(
    private readonly redis: Redis,
    private readonly config: ConfigService
  ) {
    this.limiter = new RateLimiterRedis({
      storeClient: redis,
      keyPrefix: 'rate_limit',
      points: 10, // Number of requests
      duration: 1, // Per second
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      await this.limiter.consume(req.ip);
      next();
    } catch (error) {
      throw new HttpException(
        'Too Many Requests',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
  }
}
```

### 8.2 Security Headers

```typescript
@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // HSTS
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );

    // XSS Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Prevent Clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // Disable MIME Type Sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // CSP
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    );

    next();
  }
}