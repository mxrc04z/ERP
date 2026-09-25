const responseMeta = {};

export const listBranchesController = ({ listBranches }) => async (request, response, next) => {
  try {
    const branches = await listBranches({ tenantId: request.tenantId, companyId: request.query.companyId });
    return response.json({ data: branches, meta: responseMeta, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};

export const createBranchController = ({ createBranch }) => async (request, response, next) => {
  try {
    const branch = await createBranch({
      ...request.body,
      tenantId: request.tenantId,
      actorId: request.auth?.userId ?? request.body.createdBy
    });
    return response.status(201).json({ data: branch, meta: responseMeta, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};