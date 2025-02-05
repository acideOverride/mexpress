VIII. BACKEND DEVELOPMENT STANDARDS
[⬆ Back to Top](#table-of-contents)

# backend development standards

A. Controller Architecture

1.  Base Controller Pattern:

```typescript
// controllers/base.controller.ts
abstract class BaseController {
  protected async execute(
    req: Request,
    res: Response,
    action: () => Promise<any>
  ): Promise<void> {
    try {
      const result = await action();
      this.sendResponse(res, result);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  protected sendResponse(res: Response, data: any, status = 200): void {
    res.status(status).json({
      status: 'success',
      data,
      timestamp: new Date().toISOString(),
    });
  }

  protected handleError(error: Error, res: Response): void {
    if (error instanceof ValidationError) {
      res.status(400).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: error.message,
        details: error.details,
      });
      return;
    }

    // Handle other error types...
  }
}

// Implementation example
class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();
  }

  public getUser = async (req: Request, res: Response): Promise<void> => {
    await this.execute(req, res, async () => {
      const userId = req.params.id;
      return this.userService.getUserById(userId);
    });
  };
}
```

B. Service Layer Patterns

1.  Service Structure:

```typescript
// services/base.service.ts
abstract class BaseService {
  protected abstract repository: Repository<any>;

  protected async transaction<T>(
    operation: (session: ClientSession) => Promise<T>
  ): Promise<T> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await operation(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

// Implementation
class UserService extends BaseService {
  constructor(
    protected repository: UserRepository,
    private readonly emailService: EmailService
  ) {
    super();
  }

  async createUser(userData: CreateUserDTO): Promise<User> {
    return this.transaction(async session => {
      const user = await this.repository.create(userData, { session });
      await this.emailService.sendWelcomeEmail(user.email);
      return user;
    });
  }
}
```

C. Repository Pattern

1.  Base Repository:

```typescript
// repositories/base.repository.ts
abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(conditions: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(conditions).exec();
  }

  async create(data: Partial<T>, options?: SaveOptions): Promise<T> {
    const entity = new this.model(data);
    return entity.save(options);
  }

  async update(
    id: string,
    data: UpdateQuery<T>,
    options?: QueryOptions
  ): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, data, { new: true, ...options })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}

// Implementation
class UserRepository extends BaseRepository<User> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }
}
```

D. Middleware Standards

1.  Middleware Pattern:

```typescript
// middleware/validation.middleware.ts
const createValidationMiddleware = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      req.body = validated;
      next();
    } catch (error) {
      next(new ValidationError(error.details));
    }
  };
};

// middleware/auth.middleware.ts
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req);
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new AuthenticationError('Invalid token'));
  }
};
```

E. Database Interaction

1.  Query Building:

```typescript
// utils/query-builder.ts
class QueryBuilder<T> {
  private query: FilterQuery<T> = {};
  private options: QueryOptions = {};

  where(conditions: FilterQuery<T>): this {
    this.query = { ...this.query, ...conditions };
    return this;
  }

  select(fields: string[]): this {
    this.options.select = fields.join(' ');
    return this;
  }

  populate(path: string, select?: string[]): this {
    this.options.populate = {
      path,
      select: select?.join(' '),
    };
    return this;
  }

  paginate(page: number, limit: number): this {
    this.options.skip = (page - 1) * limit;
    this.options.limit = limit;
    return this;
  }

  sort(field: string, order: 'asc' | 'desc' = 'asc'): this {
    this.options.sort = { [field]: order === 'asc' ? 1 : -1 };
    return this;
  }

  build(): { query: FilterQuery<T>; options: QueryOptions } {
    return { query: this.query, options: this.options };
  }
}
```

F. Event Handling

1.  Event System:

```typescript
// events/event-emitter.ts
type EventHandler = (...args: any[]) => Promise<void> | void;

class EventEmitter {
  private handlers: Map<string, EventHandler[]> = new Map();

  on(event: string, handler: EventHandler): void {
    const handlers = this.handlers.get(event) || [];
    handlers.push(handler);
    this.handlers.set(event, handlers);
  }

  async emit(event: string, ...args: any[]): Promise<void> {
    const handlers = this.handlers.get(event) || [];
    await Promise.all(handlers.map(handler => handler(...args)));
  }
}

// Implementation
const eventEmitter = new EventEmitter();

eventEmitter.on('user.created', async (user: User) => {
  await emailService.sendWelcomeEmail(user.email);
});

eventEmitter.on('user.created', async (user: User) => {
  await analyticsService.trackUserCreation(user);
});
```

G. Caching Strategy

1.  Cache Service:

```typescript
// services/cache.service.ts
class CacheService {
  constructor(private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length) {
      await this.redis.del(...keys);
    }
  }
}

// Cache decorator
function Cached(ttl: number = 3600) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`;
      const cached = await cacheService.get(cacheKey);

      if (cached) return cached;

      const result = await originalMethod.apply(this, args);
      await cacheService.set(cacheKey, result, ttl);
      return result;
    };
  };
}
```

H. Request Validation

1.  Validation Schemas:

```typescript
// validation/schemas/user.schema.ts
const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base':
        'Password must include upper, lower case and numbers',
    }),
});

// Usage with middleware
router.post('/users', validateRequest(userSchema), userController.createUser);
```

These backend standards provide:

- Consistent controller architecture
- Service layer patterns
- Repository abstractions
- Middleware patterns
- Database interaction standards
- Event handling
- Caching strategies
- Request validation
