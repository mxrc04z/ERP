export function registerHandlers(eventBus, logger = console) {
  return [
    eventBus.subscribe('sales.order.confirmed', async (event) => {
      logger.info(`Sales order confirmed: ${event.aggregateId}`);
    }),
    eventBus.subscribe('audit.record.requested', async (event) => {
      logger.info(`Audit event requested: ${event.aggregateId}`);
    })
  ];
}