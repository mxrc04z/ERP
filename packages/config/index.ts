export interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'test' | 'production';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export function readConfig(env: Record<string, string | undefined>): AppConfig {
  const apiUrl = env.API_URL;
  if (!apiUrl) throw new Error('API_URL is required');
  const environment = env.NODE_ENV ?? 'development';
  if (!['development', 'test', 'production'].includes(environment)) throw new Error('Invalid NODE_ENV');
  const logLevel = env.LOG_LEVEL ?? 'info';
  if (!['debug', 'info', 'warn', 'error'].includes(logLevel)) throw new Error('Invalid LOG_LEVEL');
  return { apiUrl, environment: environment as AppConfig['environment'], logLevel: logLevel as AppConfig['logLevel'] };
}