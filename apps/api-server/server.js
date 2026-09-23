import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './src/app.js';
import { connectDatabase } from './src/database/connection.js';

const port = Number(process.env.PORT ?? 4000);

const app = createApp();

await connectDatabase();
const server = app.listen(port, () => {
  console.log(`ERP API listening on port ${port}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down...`);
  await mongoose.disconnect();
  server.close(() => process.exit(0));
};

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
