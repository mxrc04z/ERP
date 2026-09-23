import type { ApiError, ApiResponse } from '@erp/contracts';

export interface ApiClientOptions {
  baseUrl: string;
  fetch?: typeof fetch;
  getToken?: () => string | undefined | Promise<string | undefined>;
  getTenantId?: () => string | undefined | Promise<string | undefined>;
}

export class ApiClientError extends Error {
  constructor(public readonly status: number, public readonly error: ApiError) {
    super(error.message);
    this.name = 'ApiClientError';
  }
}

export function createApiClient(options: ApiClientOptions) {
  const request = options.fetch ?? fetch;
  return async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers = new Headers(init.headers);
    headers.set('accept', 'application/json');
    if (init.body && !headers.has('content-type')) headers.set('content-type', 'application/json');
    const token = await options.getToken?.();
    const tenantId = await options.getTenantId?.();
    if (token) headers.set('authorization', `Bearer ${token}`);
    if (tenantId) headers.set('x-tenant-id', tenantId);

    const response = await request(`${options.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`, {
      ...init,
      headers
    });
    const payload = (await response.json()) as ApiResponse<T> | ApiError;
    if (!response.ok) {
      const error = 'code' in payload ? payload : { code: 'HTTP_ERROR', message: response.statusText };
      throw new ApiClientError(response.status, error);
    }
    return payload as ApiResponse<T>;
  };
}