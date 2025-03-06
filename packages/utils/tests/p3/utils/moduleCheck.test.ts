import { isMainModule } from '../../../src/moduleCheck';

describe('Module Check', () => {
  let originalNodeEnv: string | undefined;
  let originalRequireMain: NodeModule | undefined;

  const createTestModule = (config: {
    id?: string;
    filename?: string;
    path?: string;
  }): NodeModule => ({
    id: config.id || '',
    path: config.path || '/',
    exports: {},
    filename: config.filename || (config.id ? `${config.id}.js` : '/test.js'),
    loaded: true,
    children: [],
    paths: [],
    require: require,
    parent: null,
    isPreloading: false
  });

  beforeAll(() => {
    originalNodeEnv = process.env.NODE_ENV;
    originalRequireMain = require.main;
  });

  beforeEach(() => {
    jest.resetModules();
    // Clear NODE_ENV before each test
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    // Restore require.main
    (global as any).require = {
      ...require,
      main: originalRequireMain
    };
  });

  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  describe('Test Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('should identify test main module by ID pattern', () => {
      const testModule = createTestModule({ id: '/test/path/main' });
      expect(isMainModule(testModule)).toBe(true);
    });

    it('should handle Windows-style paths in test', () => {
      const testModule = createTestModule({ id: 'C:\\test\\path\\main' });
      expect(isMainModule(testModule)).toBe(true);
    });

    it('should handle paths with .js extension in test', () => {
      const testModule = createTestModule({ id: '/test/path/main.js' });
      expect(isMainModule(testModule)).toBe(true);
    });

    it('should handle paths with duplicate slashes in test', () => {
      const testModule = createTestModule({ id: '//test//path//main' });
      expect(isMainModule(testModule)).toBe(true);
    });

    it('should handle paths with trailing slash in test', () => {
      const testModule = createTestModule({ id: '/test/path/main/' });
      expect(isMainModule(testModule)).toBe(true);
    });

    it('should handle paths without leading slash in test', () => {
      const testModule = createTestModule({ id: 'test/path/main' });
      expect(isMainModule(testModule)).toBe(true);
    });
  });

  describe('Production Environment', () => {
    beforeEach(() => {
      // Ensure NODE_ENV is not set (production is default)
      delete process.env.NODE_ENV;
    });

    it('should identify main module by direct instance', () => {
      const mainModule = createTestModule({ id: '/app/main' });
      // Use the exact same instance
      const testModule = mainModule;
      (global as any).require = {
        ...require,
        main: mainModule
      };
      expect(isMainModule(testModule)).toBe(true);
    });

    it('should identify main module by matching ID', () => {
      const mainModule = createTestModule({ id: '/app/main' });
      const testModule = createTestModule({ id: '/app/main' });
      (global as any).require = {
        ...require,
        main: mainModule
      };
      expect(isMainModule(testModule)).toBe(true);
    });

    it('should identify main module by matching filename when IDs differ', () => {
      const mainModule = createTestModule({
        id: '/app/main',
        filename: '/app/main.js'
      });
      const testModule = createTestModule({
        id: '/app/other',
        filename: '/app/main.js'
      });
      (global as any).require = {
        ...require,
        main: mainModule
      };
      expect(isMainModule(testModule)).toBe(true);
    });

    it('should handle Windows-style paths in production', () => {
      const mainModule = createTestModule({
        id: 'C:\\app\\main',
        filename: 'C:\\app\\main.js'
      });
      const testModule = createTestModule({
        id: '/app/main',
        filename: '/app/main.js'
      });
      (global as any).require = {
        ...require,
        main: mainModule
      };
      expect(isMainModule(testModule)).toBe(true);
    });

    it('should handle paths with duplicate slashes in production', () => {
      const mainModule = createTestModule({
        id: '//app//main',
        filename: '//app//main.js'
      });
      const testModule = createTestModule({
        id: '/app/main',
        filename: '/app/main.js'
      });
      (global as any).require = {
        ...require,
        main: mainModule
      };
      expect(isMainModule(testModule)).toBe(true);
    });

    it('should handle paths with trailing slash in production', () => {
      const mainModule = createTestModule({
        id: '/app/main/',
        filename: '/app/main.js/'
      });
      const testModule = createTestModule({
        id: '/app/main',
        filename: '/app/main.js'
      });
      (global as any).require = {
        ...require,
        main: mainModule
      };
      expect(isMainModule(testModule)).toBe(true);
    });

    it('should handle paths without leading slash in production', () => {
      const mainModule = createTestModule({
        id: 'app/main',
        filename: 'app/main.js'
      });
      const testModule = createTestModule({
        id: '/app/main',
        filename: '/app/main.js'
      });
      (global as any).require = {
        ...require,
        main: mainModule
      };
      expect(isMainModule(testModule)).toBe(true);
    });

    it('should handle missing IDs but matching filenames', () => {
      const mainModule = createTestModule({
        id: '',
        filename: '/app/main.js'
      });
      const testModule = createTestModule({
        id: '',
        filename: '/app/main.js'
      });
      (global as any).require = {
        ...require,
        main: mainModule
      };
      expect(isMainModule(testModule)).toBe(true);
    });

    it('should handle missing filenames', () => {
      const mainModule = createTestModule({
        id: '/app/main',
        filename: ''
      });
      const testModule = createTestModule({
        id: '/app/main',
        filename: ''
      });
      (global as any).require = {
        ...require,
        main: mainModule
      };
      expect(isMainModule(testModule)).toBe(true);
    });

    it('should return false when no matching criteria', () => {
      const mainModule = createTestModule({
        id: '',
        filename: ''
      });
      const testModule = createTestModule({
        id: '',
        filename: ''
      });
      (global as any).require = {
        ...require,
        main: mainModule
      };
      expect(isMainModule(testModule)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should normalize empty id to empty string', () => {
      const mainModule = createTestModule({
        id: '',
        filename: '/app/main.js'
      });
      const testModule = createTestModule({
        id: '   ',  // whitespace-only id
        filename: '/app/other.js'
      });
      (global as any).require = {
        ...require,
        main: mainModule
      };
      expect(isMainModule(testModule)).toBe(false);
    });

    it('should handle cross-comparison between id and filename', () => {
      const mainModule = createTestModule({
        id: '/app/main.js',
        filename: '/app/other.js'
      });
      const testModule = createTestModule({
        id: '/app/something.js',
        filename: '/app/main.js'  // matches main module's id
      });
      (global as any).require = {
        ...require,
        main: mainModule
      };
      expect(isMainModule(testModule)).toBe(true);
    });

    it('should handle undefined module', () => {
      expect(isMainModule(undefined)).toBe(false);
    });

    it('should handle undefined require.main', () => {
      (global as any).require = {
        ...require,
        main: undefined
      };
      const testModule = createTestModule({ id: 'test' });
      expect(isMainModule(testModule)).toBe(false);
    });

    it('should handle module with empty properties', () => {
      const testModule = createTestModule({
        id: '',
        filename: '',
        path: ''
      });
      expect(isMainModule(testModule)).toBe(false);
    });

    it('should handle module with non-normalized path', () => {
      const mainModule = createTestModule({
        id: 'C:\\test\\path\\file.js',
        filename: 'C:\\test\\path\\file.js'
      });
      const testModule = createTestModule({
        id: '/test/path/file',
        filename: '/test/path/file.js'
      });
      (global as any).require = {
        ...require,
        main: mainModule
      };
      expect(isMainModule(testModule)).toBe(true);
    });
  });
});
