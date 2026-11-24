import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

// Logs method, URL, status code and response time of each request
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    // "finish" fires after the response is sent, so the status code is known
    res.on('finish', () => {
      const time = Date.now() - start;
      this.logger.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${time}ms`,
      );
    });

    next();
  }
}
