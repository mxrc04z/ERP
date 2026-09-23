export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  traceId?: string;
}

export interface ApiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
  traceId?: string;
}

export interface OpenApiDocument {
  openapi: '3.0.3' | '3.1.0';
  info: { title: string; version: string; description?: string };
  servers?: Array<{ url: string; description?: string }>;
  paths: Record<string, OpenApiPathItem>;
  components?: { schemas?: Record<string, OpenApiSchema> };
}

export interface OpenApiPathItem {
  get?: OpenApiOperation;
  post?: OpenApiOperation;
  put?: OpenApiOperation;
  patch?: OpenApiOperation;
  delete?: OpenApiOperation;
}

export interface OpenApiOperation {
  operationId: string;
  summary?: string;
  tags?: string[];
  responses: Record<string, { description: string; content?: Record<string, unknown> }>;
}

export interface OpenApiSchema {
  type?: string;
  format?: string;
  properties?: Record<string, OpenApiSchema>;
  required?: string[];
  items?: OpenApiSchema;
  enum?: string[];
}