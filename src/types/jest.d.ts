import '@types/jest';

declare global {
  namespace jest {
    interface SpyInstance<T extends (...args: unknown[]) => unknown> {
      mockImplementation(
        fn?: (...args: Parameters<T>) => ReturnType<T>
      ): SpyInstance<T>;
      mockReturnValue(value: ReturnType<T>): SpyInstance<T>;
    }
  }
}

export {};
