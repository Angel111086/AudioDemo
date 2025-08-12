import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

jest.setTimeout(10000);

let mongoServer: MongoMemoryServer;
let app: any;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
    jest.resetModules();
    app = (await import("../app")).default;
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

it("creates transcription and returns id", async () => {
    const res = await request(app)
      .post("/transcription")
      .send({ audioUrl: "https://example.com/sample.mp3" })
      .expect(201);
  
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.audioUrl).toBe("https://example.com/sample.mp3");
  });
  
  it("400 when audioUrl missing", async () => {
    await request(app).post("/transcription").send({}).expect(400);
  });
  
  it("400 when audioUrl invalid", async () => {
    const res = await request(app)
      .post("/transcription")
      .send({ audioUrl: "htp://bad" })
      .expect(400);
  
    expect(res.body.data.error).toBe(
      "Invalid audioUrl: must start with http:// or https://"
    );
  });