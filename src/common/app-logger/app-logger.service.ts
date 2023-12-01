import { Injectable, Logger, Scope } from '@nestjs/common';
import { RequestContext } from '../dto/request-context.dto';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class AppLogger {
  private logger: Logger;

  constructor(private context?: string) {
    this.logger = new Logger(context);
  }

  error(
    ctx: RequestContext,
    message: string,
    meta?: Record<string, any>,
  ): void {
    const timestamp = new Date().toISOString();
    const { url, ip } = ctx;

    this.logger.error(`Error message: ${message}`);
    this.logger.error(`Timestamp: ${timestamp}`);
    this.logger.error(`URL: ${url} - IP: ${ip} `);

    this.logger.error(`Details: ${JSON.stringify(meta)}`);
  }

  warn(ctx: RequestContext, message: string, meta?: Record<string, any>): void {
    const timestamp = new Date().toISOString();
    const { url, ip } = ctx;

    this.logger.warn(`Warning message: ${message}`);
    this.logger.warn(`Timestamp: ${timestamp}`);
    this.logger.warn(`URL: ${url} - IP: ${ip} `);

    if (meta) {
      this.logger.warn(`Details: ${JSON.stringify(meta)}`);
    }
  }

  debug(
    ctx: RequestContext,
    message: string,
    meta?: Record<string, any>,
  ): void {
    const timestamp = new Date().toISOString();
    const { url, ip } = ctx;

    this.logger.debug(`URL: ${url} - IP: ${ip} `);
    this.logger.debug(message);
    this.logger.debug(`Timestamp: ${timestamp}`);

    if (meta) {
      this.logger.debug(`Details: ${JSON.stringify(meta)}`);
    }
  }

  verbose(
    ctx: RequestContext,
    message: string,
    meta?: Record<string, any>,
  ): void {
    const timestamp = new Date().toISOString();
    const { url, ip } = ctx;

    this.logger.verbose(message);
    this.logger.verbose(`URL: ${url} - IP: ${ip} `);
    this.logger.verbose(`Timestamp: ${timestamp}`);

    if (meta) {
      this.logger.verbose(`Details: ${JSON.stringify(meta)}`);
    }
  }

  log(ctx: RequestContext, message: string, meta?: Record<string, any>): void {
    const timestamp = new Date().toISOString();
    const { url, ip } = ctx;

    this.logger.log(`URL: ${url} - IP: ${ip} `);
    this.logger.log(message);
    this.logger.log(`Timestamp: ${timestamp}`);

    if (meta) {
      this.logger.log(`Details: ${JSON.stringify(meta)}`);
    }
  }
}
