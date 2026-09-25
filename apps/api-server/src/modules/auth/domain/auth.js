export function requireCredentials({ email, password }) {
  if (!email || !password) {
    throw Object.assign(new Error('Email and password are required.'), { code: 'INVALID_CREDENTIALS', statusCode: 400, expose: true });
  }
}

export function requireRegistrationData({ email, password, displayName }) {
  if (!email || !password || !displayName) {
    throw Object.assign(new Error('Email, password and displayName are required.'), { code: 'VALIDATION_ERROR', statusCode: 400, expose: true });
  }
}