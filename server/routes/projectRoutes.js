import express from "express";
import { getProjects, createProject, deleteProject } from "../controllers/projectController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // Protect all project routes

router.route("/").get(getProjects).post(createProject);
router.route("/:id").delete(deleteProject);

export default router;
