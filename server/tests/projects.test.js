import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { createAuthedUser } from "./helpers.js";

describe("Projects", () => {
    it("creates, lists, archives, restores, and deletes a project", async () => {
        const { token } = await createAuthedUser();

        const createRes = await request(app)
            .post("/api/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Launch", color: "#6366f1" });
        expect(createRes.status).toBe(201);

        let listRes = await request(app).get("/api/projects").set("Authorization", `Bearer ${token}`);
        expect(listRes.body).toHaveLength(1);

        const archiveRes = await request(app)
            .put(`/api/projects/${createRes.body._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ archived: true });
        expect(archiveRes.status).toBe(200);
        expect(archiveRes.body.archived).toBe(true);

        listRes = await request(app).get("/api/projects").set("Authorization", `Bearer ${token}`);
        expect(listRes.body).toHaveLength(0);

        listRes = await request(app)
            .get("/api/projects")
            .set("Authorization", `Bearer ${token}`)
            .query({ archived: "true" });
        expect(listRes.body).toHaveLength(1);

        const restoreRes = await request(app)
            .put(`/api/projects/${createRes.body._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ archived: false });
        expect(restoreRes.body.archived).toBe(false);

        const deleteRes = await request(app)
            .delete(`/api/projects/${createRes.body._id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(deleteRes.status).toBe(200);

        listRes = await request(app).get("/api/projects").set("Authorization", `Bearer ${token}`);
        expect(listRes.body).toHaveLength(0);
    });

    it("scopes projects per user", async () => {
        const { token: tokenA } = await createAuthedUser();
        const { token: tokenB } = await createAuthedUser();

        await request(app)
            .post("/api/projects")
            .set("Authorization", `Bearer ${tokenA}`)
            .send({ name: "A's project" });

        const res = await request(app).get("/api/projects").set("Authorization", `Bearer ${tokenB}`);
        expect(res.body).toHaveLength(0);
    });

    it("prevents one user from deleting another user's project", async () => {
        const { token: tokenA } = await createAuthedUser();
        const { token: tokenB } = await createAuthedUser();

        const createRes = await request(app)
            .post("/api/projects")
            .set("Authorization", `Bearer ${tokenA}`)
            .send({ name: "A's project" });

        const res = await request(app)
            .delete(`/api/projects/${createRes.body._id}`)
            .set("Authorization", `Bearer ${tokenB}`);
        expect(res.status).toBe(401);
    });
});
