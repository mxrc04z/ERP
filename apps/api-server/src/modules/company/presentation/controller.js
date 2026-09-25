const responseMeta = {};

export const listCompaniesController = ({ listCompanies }) => async (request, response, next) => {
  try {
    const companies = await listCompanies({ tenantId: request.tenantId });
    return response.json({ data: companies, meta: responseMeta, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};

export const createCompanyController = ({ createCompany }) => async (request, response, next) => {
  try {
    const company = await createCompany({
      ...request.body,
      tenantId: request.tenantId,
      actorId: request.auth?.userId ?? request.body.createdBy
    });
    return response.status(201).json({ data: company, meta: responseMeta, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};