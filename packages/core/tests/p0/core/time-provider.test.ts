import { TestTimeProvider } from '../../../src/core/time/time-provider';

describe('TestTimeProvider', () => {
    let timeProvider: TestTimeProvider;

    beforeEach(() => {
        timeProvider = new TestTimeProvider();
    });

    describe('setTimeout', () => {
        test('should schedule callback execution', () => {
            const callback = jest.fn();
            timeProvider.setTimeout(callback, 1000);
            expect(callback).not.toBeCalled();
            timeProvider.advance(1000);
            expect(callback).toBeCalledTimes(1);
        });

        test('should throw for invalid callback', () => {
            expect(() => timeProvider.setTimeout(null as any, 1000))
                .toThrow(TypeError);
            expect(() => timeProvider.setTimeout(undefined as any, 1000))
                .toThrow(TypeError);
            expect(() => timeProvider.setTimeout({} as any, 1000))
                .toThrow(TypeError);
        });

        test('should throw for negative delay', () => {
            expect(() => timeProvider.setTimeout(() => {}, -1))
                .toThrow(RangeError);
        });

        test('should return unique timeout IDs', () => {
            const id1 = timeProvider.setTimeout(() => {}, 1000);
            const id2 = timeProvider.setTimeout(() => {}, 1000);
            expect(id1).not.toBe(id2);
        });
    });

    describe('clearTimeout', () => {
        test('should cancel scheduled callback', () => {
            const callback = jest.fn();
            const id = timeProvider.setTimeout(callback, 1000);
            timeProvider.clearTimeout(id);
            timeProvider.advance(1000);
            expect(callback).not.toBeCalled();
        });

        test('should handle clearing invalid timeout ID', () => {
            expect(() => timeProvider.clearTimeout(999)).not.toThrow();
        });

        test('should handle clearing already executed timeout', () => {
            const callback = jest.fn();
            const id = timeProvider.setTimeout(callback, 1000);
            timeProvider.advance(1000);
            expect(() => timeProvider.clearTimeout(id)).not.toThrow();
        });
    });

    describe('now', () => {
        test('should track current time', () => {
            expect(timeProvider.now()).toBe(0);
            timeProvider.advance(1000);
            expect(timeProvider.now()).toBe(1000);
            timeProvider.advance(500);
            expect(timeProvider.now()).toBe(1500);
        });
    });

    describe('advance', () => {
        test('should execute timeouts in chronological order', () => {
            const order: number[] = [];
            timeProvider.setTimeout(() => order.push(1), 1000);
            timeProvider.setTimeout(() => order.push(2), 2000);
            timeProvider.setTimeout(() => order.push(3), 3000);
            timeProvider.advance(3000);
            expect(order).toEqual([1, 2, 3]);
        });

        test('should handle multiple timeouts at same time', () => {
            const callbacks = [jest.fn(), jest.fn(), jest.fn()];
            callbacks.forEach(cb => timeProvider.setTimeout(cb, 1000));
            timeProvider.advance(1000);
            callbacks.forEach(cb => expect(cb).toBeCalledTimes(1));
        });

        test('should handle partial advances', () => {
            const callback = jest.fn();
            timeProvider.setTimeout(callback, 1000);
            timeProvider.advance(500);
            expect(callback).not.toBeCalled();
            timeProvider.advance(500);
            expect(callback).toBeCalledTimes(1);
        });

        test('should maintain accurate time tracking with multiple advances', () => {
            const times: number[] = [];
            timeProvider.setTimeout(() => times.push(timeProvider.now()), 1000);
            timeProvider.setTimeout(() => times.push(timeProvider.now()), 2000);
            timeProvider.advance(2000);
            expect(times).toEqual([1000, 2000]);
        });

        test('should handle zero delay timeouts', () => {
            const callback = jest.fn();
            timeProvider.setTimeout(callback, 0);
            timeProvider.advance(0);
            expect(callback).toBeCalledTimes(1);
        });

        test('should handle advance with no timeouts', () => {
            expect(() => timeProvider.advance(1000)).not.toThrow();
        });
    });

    describe('Error Handling', () => {
        test('should handle errors in callbacks', () => {
            const errorCallback = () => { throw new Error('Test error'); };
            timeProvider.setTimeout(errorCallback, 1000);
            expect(() => timeProvider.advance(1000)).toThrow('Test error');
        });

        test('should continue executing remaining callbacks after error', () => {
            const errorCallback = () => { throw new Error('Test error'); };
            const successCallback = jest.fn();
            
            timeProvider.setTimeout(errorCallback, 1000);
            timeProvider.setTimeout(successCallback, 2000);
            
            expect(() => timeProvider.advance(1000)).toThrow('Test error');
            timeProvider.advance(1000);
            expect(successCallback).toBeCalledTimes(1);
        });
    });
});
