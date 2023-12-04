import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logFile = './logs/logs.txt';
  use(req: Request, res: Response, next: NextFunction) {
    const ip: string = req.ip;
    const route: string = req.originalUrl;
    const params: string = JSON.stringify(req.query);
    const timestamp: string = new Date().toISOString();

    const logLine = `IP: ${ip} - Route: ${route} - Params : ${params} - Date : ${timestamp}\n`;

    fs.appendFile(this.logFile, logLine, (err) => {
      if (err) {
        console.error('Error writing to logs.txt:', err);
      }
    });
    next();
  }
}
