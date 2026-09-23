export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}

export interface TraceContext {
  traceId: string;
  spanId?: string;
}

export function createConsoleLogger(context: TraceContext = { traceId: 'unknown' }): Logger {
  const write = (method: 'debug' | 'info' | 'warn' | 'error', message: string, extra?: Record<string, unknown>) => {
    console[method](JSON.stringify({ ...context, message, ...extra }));
  };
  return { debug: (m, c) => write('debug', m, c), info: (m, c) => write('info', m, c), warn: (m, c) => write('warn', m, c), error: (m, c) => write('error', m, c) };
}