import { Router } from 'express';
import { createCompanyController, listCompaniesController } from './presentation/controller.js';
import { createCompanyService, listCompaniesService } from './application/service.js';
import { createCompanyRepository } from './infrastructure/repository.js';
import { requirePermission } from '../../middleware/authorization.js';
import { PERMISSIONS } from '../../middleware/permissions.js';

export const companyRouter = Router();

const repository = createCompanyRepository();
const listCompanies = listCompaniesService({ repository });
const createCompany = createCompanyService({ repository });

companyRouter.get('/', requirePermission(PERMISSIONS.COMPANIES_READ), listCompaniesController({ listCompanies }));
companyRouter.post('/', requirePermission(PERMISSIONS.COMPANIES_WRITE), createCompanyController({ createCompany }));