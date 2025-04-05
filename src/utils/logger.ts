import chalk from 'chalk';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
  private static instance: Logger;
  private level: LogLevel = 'info';

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    return levels[level] >= levels[this.level];
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(chalk.gray('DEBUG:'), message, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(chalk.blue('INFO:'), message, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(chalk.yellow('WARN:'), message, ...args);
    }
  }

  error(message: string, error?: Error, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(chalk.red('ERROR:'), message);
      if (error?.stack) {
        console.error(chalk.red(error.stack));
      }
      if (args.length) {
        console.error(...args);
      }
    }
  }

  success(message: string): void {
    console.log(chalk.green('✓'), message);
  }
}
