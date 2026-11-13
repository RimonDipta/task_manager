import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  bulkUpdateTasks,
  bulkDeleteTasks,
} from "../controllers/taskController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getTasks).post(protect, createTask);

// Must be registered before "/:id" so "bulk" isn't matched as an id param.
router.route("/bulk").put(protect, bulkUpdateTasks).delete(protect, bulkDeleteTasks);

router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

export default router;
