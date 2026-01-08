import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    description: String,
    priority: { type: String, enum: ["p1", "p2", "p3", "p4"], default: "p4" },
    dueDate: Date,
    completed: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["todo", "doing", "done"],
      default: "todo",
    },
    recurrence: {
      type: { type: String, enum: ["none", "daily", "weekly", "monthly"], default: "none" },
      interval: { type: Number, default: 1 },
    },
    isAutoPriority: { type: Boolean, default: false },
    reminder: { type: Date },
    reminderSent: { type: Boolean, default: false },
    timeSpent: { type: Number, default: 0 }, // in minutes
    duration: { type: Number, default: 0 }, // planned duration in minutes
    startTime: { type: Date }, // When the task/timer started
    displayTime: { type: String }, // User formatted time string if needed, or rely on reminder
    completedAt: { type: Date },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
