import Task from "../models/Task.js";

// Run every minute
export const startScheduler = () => {
    console.log("⏱️ Scheduler started...");

    setInterval(async () => {
        try {
            const now = new Date();

            // 1. Auto-Priority: Due in < 24 hours -> P1 (High)
            const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            const urgentTasks = await Task.updateMany(
                {
                    dueDate: { $lt: twentyFourHoursFromNow, $gt: now },
                    completed: false,
                    priority: { $ne: "p1" },
                    isAutoPriority: false
                },
                { $set: { priority: "p1", isAutoPriority: true } }
            );
            if (urgentTasks.modifiedCount > 0) {
                console.log(`🚀 Auto-Priority: Bumped ${urgentTasks.modifiedCount} tasks to P1 (High).`);
            }

            // 2. Task Aging: Created > 7 days ago & P3 (Low) -> P2 (Medium)
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const agingTasks = await Task.updateMany(
                {
                    createdAt: { $lt: sevenDaysAgo },
                    completed: false,
                    priority: "p3"
                },
                { $set: { priority: "p2", isAutoPriority: true } }
            );
            if (agingTasks.modifiedCount > 0) {
                console.log(`👴 Task Aging: Bumped ${agingTasks.modifiedCount} old tasks to P2 (Medium).`);
            }

            // 3. Reminders
            const reminders = await Task.find({
                reminder: { $lt: now },
                reminderSent: false,
                completed: false
            });

            for (const task of reminders) {
                console.log(`📧 SENDING REMINDER for task "${task.title}" to User ${task.user} (Simulated Email)`);
                task.reminderSent = true;
                await task.save();
            }

        } catch (error) {
            console.error("Scheduler Error:", error);
        }
    }, 60000); // Check every 60 seconds
};
