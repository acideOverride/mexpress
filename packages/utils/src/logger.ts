/// <reference types="node" />

/**
 * Application logger
 */
export const logger = {
  info: (message: string, ...args: unknown[]): void => {
    process.stdout.write(`[INFO]: ${message}\n`);
    if (args.length > 0) {
      process.stdout.write(`${JSON.stringify(args, null, 2)}\n`);
    }
  },

  error: (message: string | Error, ...args: unknown[]): void => {
    const errorMessage = message instanceof Error ? message.message : message;
    process.stderr.write(`[ERROR]: ${errorMessage}\n`);
    if (args.length > 0) {
      process.stderr.write(`${JSON.stringify(args, null, 2)}\n`);
    }
    if (message instanceof Error && message.stack) {
      process.stderr.write(`${message.stack}\n`);
    }
  },

  warn: (message: string, ...args: unknown[]): void => {
    process.stdout.write(`[WARN]: ${message}\n`);
    if (args.length > 0) {
      process.stdout.write(`${JSON.stringify(args, null, 2)}\n`);
    }
  },

  debug: (message: string, ...args: unknown[]): void => {
    if (process.env.DEBUG === 'true') {
      process.stdout.write(`[DEBUG]: ${message}\n`);
      if (args.length > 0) {
        process.stdout.write(`${JSON.stringify(args, null, 2)}\n`);
      }
    }
  }
};
