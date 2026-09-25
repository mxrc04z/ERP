import { User } from '../../users/infrastructure/model.js';
import { Identity } from '../../identity/infrastructure/model.js';
import { Role } from '../../iam/infrastructure/model.js';
import { AuthSession } from './model.js';

export function createAuthRepository() {
  return {
    findUser: (tenantId, email) => User.findOne({ tenantId, email }),
    findUserById: (tenantId, userId) => User.findOne({ tenantId, _id: userId }),
    findLocalIdentity: (tenantId, userId) => Identity.findOne({ tenantId, userId, provider: 'local' }),
    findRoles: (tenantId, names) => Role.find({ tenantId, name: { $in: names } }).lean(),
    createSession: (data) => AuthSession.create(data),
    revokeSession: (token) => AuthSession.findOneAndUpdate({ token }, { revokedAt: new Date() }),
    createUser: (data) => User.create(data),
    createIdentity: (data) => Identity.create(data)
  };
}