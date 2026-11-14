import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { createAuthedUser } from "./helpers.js";

describe("Tasks", () => {
    let token;

    beforeEach(async () => {
        ({ token } = await createAuthedUser());
    });

    it("rejects requests without a token", async () => {
        const res = await request(app).get("/api/tasks");
        expect(res.status).toBe(401);
    });

    it("creates and lists a task", async () => {
        const createRes = await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Write tests", priority: "p1" });

        expect(createRes.status).toBe(201);
        expect(createRes.body.title).toBe("Write tests");

        const listRes = await request(app)
            .get("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .query({ filter: "all" });

        expect(listRes.status).toBe(200);
        expect(listRes.body.total).toBe(1);
        expect(listRes.body.tasks[0].title).toBe("Write tests");
    });

    it("excludes archived tasks from the default list but includes them under filter=archived", async () => {
        const createRes = await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Archive me", status: "archived" });

        const allRes = await request(app)
            .get("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .query({ filter: "all" });
        expect(allRes.body.total).toBe(0);

        const archivedRes = await request(app)
            .get("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .query({ filter: "archived" });
        expect(archivedRes.body.total).toBe(1);
        expect(archivedRes.body.tasks[0]._id).toBe(createRes.body._id);
    });

    it("updates a task and keeps completed/status in sync", async () => {
        const createRes = await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Finish me" });

        const updateRes = await request(app)
            .put(`/api/tasks/${createRes.body._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ completed: true });

        expect(updateRes.status).toBe(200);
        expect(updateRes.body.status).toBe("done");
        expect(updateRes.body.completed).toBe(true);
    });

    it("deletes a task", async () => {
        const createRes = await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Delete me" });

        const deleteRes = await request(app)
            .delete(`/api/tasks/${createRes.body._id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(deleteRes.status).toBe(200);

        const listRes = await request(app)
            .get("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .query({ filter: "all" });
        expect(listRes.body.total).toBe(0);
    });

    it("prevents one user from updating another user's task", async () => {
        const createRes = await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Mine" });

        const { token: otherToken } = await createAuthedUser();

        const updateRes = await request(app)
            .put(`/api/tasks/${createRes.body._id}`)
            .set("Authorization", `Bearer ${otherToken}`)
            .send({ title: "Hijacked" });

        expect(updateRes.status).toBe(401);
    });

    it("bulk-completes then bulk-deletes tasks", async () => {
        const a = await request(app).post("/api/tasks").set("Authorization", `Bearer ${token}`).send({ title: "A" });
        const b = await request(app).post("/api/tasks").set("Authorization", `Bearer ${token}`).send({ title: "B" });
        const ids = [a.body._id, b.body._id];

        const bulkUpdateRes = await request(app)
            .put("/api/tasks/bulk")
            .set("Authorization", `Bearer ${token}`)
            .send({ ids, data: { completed: true } });

        expect(bulkUpdateRes.status).toBe(200);
        expect(bulkUpdateRes.body).toHaveLength(2);
        expect(bulkUpdateRes.body.every((t) => t.completed)).toBe(true);

        const bulkDeleteRes = await request(app)
            .delete("/api/tasks/bulk")
            .set("Authorization", `Bearer ${token}`)
            .send({ ids });
        expect(bulkDeleteRes.status).toBe(200);

        const listRes = await request(app)
            .get("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .query({ filter: "all" });
        expect(listRes.body.total).toBe(0);
    });
});
