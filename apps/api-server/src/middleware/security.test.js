import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { extractBearerToken, signAccessToken, verifyAccessToken } from './auth.js';
import { requirePermission } from './authorization.js';

function mockRequest(auth = null, extra = {}) {
  return { auth, header: () => undefined, id: 'test-trace', ...extra };
}

function mockResponse() {
  return { status: () => mockResponse(), json: () => mockResponse() };
}

describe('auth token helpers', () => {
  it('supports round-tripping an access token', () => {
    const payload = { userId: 'u1', tenantId: 'empresa-a', roles: ['admin'], permissions: ['users:read'] };
    const token = signAccessToken(payload);
    const decoded = verifyAccessToken(token);
    assert.equal(decoded.userId, 'u1');
    assert.equal(decoded.tenantId, 'empresa-a');
    assert.deepEqual(decoded.permissions, ['users:read']);
  });

  it('rejects a tampered token', () => {
    const token = signAccessToken({ userId: 'u1', tenantId: 'empresa-a' });
    const tampered = `${token.slice(0, -2)}xx`;
    assert.throws(() => verifyAccessToken(tampered));
  });
});

describe('extractBearerToken', () => {
  it('extracts a Bearer token from the authorization header', () => {
    const request = { header: (name) => (name.toLowerCase() === 'authorization' ? 'Bearer abc.def.ghi' : undefined) };
    assert.equal(extractBearerToken(request), 'abc.def.ghi');
  });

  it('returns null without an authorization header', () => {
    assert.equal(extractBearerToken({ header: () => undefined }), null);
  });

  it('returns null for a non-Bearer scheme', () => {
    const request = { header: (name) => (name.toLowerCase() === 'authorization' ? 'Basic abc' : undefined) };
    assert.equal(extractBearerToken(request), null);
  });
});

describe('requirePermission', () => {
  it('rejects when no authenticated actor is present', () => {
    const next = () => assert.fail('should not call next');
    let statusCode = null;
    const response = {
      status(code) { statusCode = code; return this; },
      json() { return this; }
    };
    requirePermission('users:read')(mockRequest(null), response, next);
    assert.equal(statusCode, 401);
  });

  it('allows an actor holding the permission', () => {
    let calledNext = false;
    const next = () => { calledNext = true; };
    requirePermission('users:read')(mockRequest({ userId: 'u1', permissions: ['users:read'] }), mockResponse(), next);
    assert.equal(calledNext, true);
  });

  it('allows a wildcard permission holder', () => {
    let calledNext = false;
    const next = () => { calledNext = true; };
    requirePermission('users:read')(mockRequest({ userId: 'u1', permissions: ['*'] }), mockResponse(), next);
    assert.equal(calledNext, true);
  });

  it('denies an actor without the permission', () => {
    const next = () => assert.fail('should not call next');
    let statusCode = null;
    const response = {
      status(code) { statusCode = code; return this; },
      json() { return this; }
    };
    requirePermission('users:write')(mockRequest({ userId: 'u1', permissions: ['users:read'] }), response, next);
    assert.equal(statusCode, 403);
  });
});