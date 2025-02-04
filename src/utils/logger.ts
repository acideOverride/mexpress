/// <reference types="node" />

/**
 * Application logger
 */
export const logger = {
  info: (message: string, ...args: unknown[]): void => {
    process.stdout.write(`[INFO] ${message}\n`);
    if (args.length > 0) {
      process.stdout.write(`${JSON.stringify(args, null, 2)}\n`);
    }
  },

  error: (message: string, ...args: unknown[]): void => {
    process.stderr.write(`[ERROR] ${message}\n`);
    if (args.length > 0) {
      process.stderr.write(`${JSON.stringify(args, null, 2)}\n`);
    }
  },
};
