import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

// Allows the request only if the x-api-key header matches API_KEY in .env
@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];

    if (!process.env.API_KEY || apiKey !== process.env.API_KEY) {
      throw new ForbiddenException('Invalid or missing x-api-key header');
    }
    return true;
  }
}
