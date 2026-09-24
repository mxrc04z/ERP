import 'dotenv/config';
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { connectDatabase } from './connection.js';

const hasMongoUri = Boolean(process.env.MONGODB_URI);
const skipWithoutDb = { skip: !hasMongoUri };

before(async () => {
  if (!hasMongoUri) return;
  await connectDatabase();
});

after(async () => {
  await mongoose.disconnect();
});

test('la URI de MongoDB proviene de variables de entorno', skipWithoutDb, () => {
  assert.ok(hasMongoUri, 'MONGODB_URI debe estar definida en las variables de entorno');
  assert.ok(process.env.MONGODB_URI.startsWith('mongodb+srv://'));
});

test('se conecta a MongoDB Atlas (readyState === 1)', skipWithoutDb, () => {
  assert.equal(mongoose.connection.readyState, 1);
});

test('el servidor responde al ping', skipWithoutDb, async () => {
  const { ok } = await mongoose.connection.db.admin().ping();
  assert.equal(ok, 1);
});

test('round-trip de escritura/lectura y limpieza en Atlas', skipWithoutDb, async () => {
  const db = mongoose.connection.db;
  const collectionName = `__connectivity_check_${Date.now()}`;
  const collection = db.collection(collectionName);

  try {
    const inserted = { tenantId: 'connectivity-check', value: 'hello', at: new Date() };
    const { insertedId } = await collection.insertOne(inserted);
    assert.ok(insertedId);

    const found = await collection.findOne({ _id: insertedId });
    assert.ok(found);
    assert.equal(found.value, 'hello');

    await collection.updateOne({ _id: insertedId }, { $set: { value: 'updated' } });
    const updated = await collection.findOne({ _id: insertedId });
    assert.equal(updated.value, 'updated');
  } finally {
    await collection.drop().catch(() => {});
  }
});