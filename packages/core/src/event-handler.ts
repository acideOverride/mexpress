import { EventEmitter } from 'events';

interface EventHandler {
  on(event: string, listener: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): boolean;
  removeListener(event: string, listener: (...args: any[]) => void): void;
  removeAllListeners(event?: string): void;
}

interface EventOptions {
  maxListeners?: number;
  errorHandler?: (error: Error) => void;
}

class CustomEventHandler implements EventHandler {
  private emitter: EventEmitter;
  private errorHandler: (error: Error) => void;

  constructor(options: EventOptions = {}) {
    this.emitter = new EventEmitter();
    if (options.maxListeners) {
      this.emitter.setMaxListeners(options.maxListeners);
    }
    this.errorHandler = options.errorHandler || ((error: Error) => {
      console.error('Event Handler Error:', error);
    });

    // Handle internal errors
    this.emitter.on('error', (error: Error) => {
      this.errorHandler(error);
    });
  }

  on(event: string, listener: (...args: any[]) => void): void {
    try {
      this.emitter.on(event, listener);
    } catch (error) {
      this.errorHandler(error as Error);
    }
  }

  emit(event: string, ...args: any[]): boolean {
    try {
      return this.emitter.emit(event, ...args);
    } catch (error) {
      this.errorHandler(error as Error);
