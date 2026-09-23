import { EventBus } from './src/eventBus.js';
import { registerHandlers } from './src/handlers.js';

const eventBus = new EventBus();
const unsubscribe = registerHandlers(eventBus);
const keepAlive = setInterval(() => {}, 60_000);

console.log('ERP worker started. Event bus is ready.');

const shutdown = (signal) => {
  clearInterval(keepAlive);
  unsubscribe.forEach((removeHandler) => removeHandler());
  console.log(`${signal} received. Worker stopped.`);
  process.exit(0);
};

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));