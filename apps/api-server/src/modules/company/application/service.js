import { buildCompany } from '../domain/company.js';

export const listCompaniesService = ({ repository }) => ({ tenantId }) => repository.findByTenant(tenantId);

export const createCompanyService = ({ repository }) => (input) => repository.create(buildCompany(input));