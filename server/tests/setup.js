// Global test setup: spins up an in-memory MongoDB so the test suite never
// touches a real database (and needs no MONGO_URI), connects mongoose to
// it, and wipes every collection between tests for isolation.
import { beforeAll, afterAll, afterEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
process.env.NODE_ENV = "test";

let mongod;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
});

afterEach(async () => {
    const { collections } = mongoose.connection;
    await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
});
