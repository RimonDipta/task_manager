import Task from "../models/Task.js";

// @desc Get all tasks (logged-in user)
// @route GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const filter = req.query.filter || "all"; // all, today, upcoming, completed, overdue, top_priorities

    const query = {
      user: req.user,
      title: { $regex: search, $options: "i" },
    };

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    if (filter === "today") {
      // Today OR Overdue OR No Date (Backlog)
      query.$or = [
        { dueDate: { $gte: todayStart, $lte: todayEnd } }, // Today
        { dueDate: { $lt: todayStart }, completed: false }, // Overdue
        { dueDate: null }, // Backlog
        { dueDate: { $exists: false } } // Backlog check
      ];
      // Exclude completed unless it was done today?
      // Usually "Today" view focuses on what needs to be done.
      // But if I finished it today, it's nice to see.
      // Let's keep it simple: Show pending + Done *Today*.
      // Actually simpler logic:
      // Show (Due Today OR Overdue OR No Date) AND (Pending OR Completed Today)
      // For now, let's just stick to the $or logic. It might show old completed tasks if they are "Overdue" but completed.
      // Fix: If completed=true, due date must be today or null?
      // Let's refine:
      // (Pending AND (Due <= Today OR Null)) OR (Completed AND DoneAt == Today) -> Too complex for now.
      // Simplest "Today" View:
      // 1. Due Today (Any Status)
      // 2. Overdue (Pending Only)
      // 3. No Date (Pending Only - backlog usually pending)

      query.$or = [
        { dueDate: { $gte: todayStart, $lte: todayEnd } },
        { dueDate: { $lt: todayStart }, completed: false },
        { dueDate: null, completed: false },
        { dueDate: { $exists: false }, completed: false }
      ];
    } else if (filter === "upcoming") {
      query.dueDate = { $gt: todayEnd };
    } else if (filter === "completed") {
      query.completed = true;
    } else if (filter === "overdue") {
      query.dueDate = { $lt: todayStart };
      query.completed = false;
    }

    const total = await Task.countDocuments(query);

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 }) // Maybe sort by priority default? Or dueDate?
      // Let's keep createdAt for consistency, or maybe 'dueDate' for Today view?
      // Default newest first is okay.
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      tasks,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Error in getTasks:", error);
    res.status(500).json({ message: "Server Error fetching tasks" });
  }
};

// @desc Create task
// @route POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, recurrence, reminder, duration, startTime, tags, status, isAutoPriority } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      user: req.user,
      title,
      description,
      priority,
      dueDate,
      recurrence,
      reminder,
      duration,
      startTime,
      tags,
      status,
      isAutoPriority
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error in createTask:", error);
    res.status(500).json({ message: "Server Error creating task" });
  }
};

// @desc Update task
// @route PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (task.user.toString() !== req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // Sync completed <-> status
  if (req.body.status) {
    req.body.completed = req.body.status === "done";
  } else if (req.body.completed !== undefined) {
    req.body.status = req.body.completed ? "done" : "todo";
  }

  // Handle completedAt logic
  const isNowDone = req.body.status === "done" || req.body.completed === true;
  const wasDone = task.status === "done" || task.completed === true;

  if (isNowDone && !wasDone) {
    req.body.completedAt = new Date();
  } else if (!isNowDone && wasDone) {
    req.body.completedAt = null; // Unset if reopened
  }

  // Check for completion and recurrence
  if (req.body.completed && !task.completed && task.recurrence && task.recurrence.type !== "none") {
    // ... (recurrence logic remains the same)
    const nextDueDate = new Date(task.dueDate || new Date());
    const interval = task.recurrence.interval || 1;

    if (task.recurrence.type === "daily") {
      nextDueDate.setDate(nextDueDate.getDate() + interval);
    } else if (task.recurrence.type === "weekly") {
      nextDueDate.setDate(nextDueDate.getDate() + 7 * interval);
    } else if (task.recurrence.type === "monthly") {
      nextDueDate.setMonth(nextDueDate.getMonth() + interval);
    }

    await Task.create({
      user: task.user,
      title: task.title,
      description: task.description,
      priority: task.priority,
      recurrence: {
        type: task.recurrence.type,
        interval: task.recurrence.interval
      },
      dueDate: nextDueDate,
      reminder: task.reminder ? new Date(nextDueDate.getTime() - (task.dueDate.getTime() - task.reminder.getTime())) : undefined,
      status: "todo", // New recurrence starts as todo
      completed: false
    });
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(updatedTask);
};

// @desc Delete task
// @route DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (task.user.toString() !== req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await task.deleteOne();
  res.json({ message: "Task removed" });
};
