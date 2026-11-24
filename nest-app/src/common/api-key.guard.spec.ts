import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ApiKeyGuard } from './api-key.guard';

// Build a fake request context with the given headers
function contextWith(headers: Record<string, string>): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ headers }) }),
  } as unknown as ExecutionContext;
}

describe('ApiKeyGuard', () => {
  const guard = new ApiKeyGuard();

  beforeEach(() => {
    process.env.API_KEY = 'test-key';
  });

  it('allows a request with the correct x-api-key', () => {
    expect(guard.canActivate(contextWith({ 'x-api-key': 'test-key' }))).toBe(true);
  });

  it('rejects a request without x-api-key with 403', () => {
    expect(() => guard.canActivate(contextWith({}))).toThrow(ForbiddenException);
  });

  it('rejects a request with a wrong x-api-key with 403', () => {
    expect(() =>
      guard.canActivate(contextWith({ 'x-api-key': 'wrong' })),
    ).toThrow(ForbiddenException);
  });
});
