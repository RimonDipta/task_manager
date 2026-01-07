import { useContext, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { TaskContext } from "../context/TaskContext";
import { isToday, isFuture, isValid } from "date-fns";
import { Flag, AlertCircle } from "lucide-react";
import TimeTracker from "./TimeTracker";

const KanbanBoard = ({ filterType = "all", filters }) => {
    const { tasks, updateTask } = useContext(TaskContext);
    const [columns, setColumns] = useState({
        todo: { name: "To Do", items: [] },
        doing: { name: "In Progress", items: [] },
        done: { name: "Done", items: [] },
    });

    useEffect(() => {
        if (tasks) {
            // Apply Global Filters First
            const filteredTasks = tasks.filter(task => {
                // 1. Date Logic
                if (filterType === "all") {
                    // Show everything (that isn't deleted). 
                    // No date filtering applied.

                    // But typically we might hide Completed items from ToDo/Doing columns?
                    // Kanban usually moves them to Done. So we keep them.
                    return true;
                }

                if (filterType === "today") {
                    if (!task.dueDate) return false;
                    const date = new Date(task.dueDate);
                    if (!isValid(date) || !isToday(date)) return false;
                }
                if (filterType === "upcoming") {
                    if (!task.dueDate) return false;
                    const date = new Date(task.dueDate);
                    if (!isValid(date) || !isFuture(date) || isToday(date)) return false;
                }
                if (filterType === "completed") {
                    // Logic: likely show all completed? But Kanban separates by status.
                    // If we are in "Completed" view, does KanBan make sense? 
                    // Usually Kanban shows Todo -> Done.
                    // If filterType is completed, we might restricts to ONLY 'done' column?
                    // Or maybe we treat it as just showing completed tasks in their respective finished state?
                    // Let's assume standard filtering:
                    return task.completed;
                } else {
                    // Hide completed tasks in non-completed views? 
                    // Typically Kanban board shows 'Done' column. 
                    // If we hide completed tasks, 'Done' column is empty.
                    // The user is asking for "Display Layout" toggle. 
                    // If I'm on "Today" and switch to Board, I expect to see Today's tasks in Todo/Doing/Done.
                    // So we should NOT hide completed tasks blindly.
                    // However, the `TaskList` logic hides them.
                    // Let's stick to standard Kanban behavior: Show all statuses, but respect Date/Priority.
                }

                // 2. Priority Logic
                if (filters && filters.priority !== "all" && task.priority !== filters.priority) {
                    return false;
                }

                return true;
            });

            setColumns({
                todo: { name: "To Do", items: filteredTasks.filter((t) => !t.status || t.status === "todo") },
                doing: { name: "In Progress", items: filteredTasks.filter((t) => t.status === "doing") },
                done: { name: "Done", items: filteredTasks.filter((t) => t.status === "done") },
            });
        }
    }, [tasks, filterType, filters]);

    const onDragEnd = async (result) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: { ...sourceColumn, items: sourceItems },
                [destination.droppableId]: { ...destColumn, items: destItems },
            });

            // Update Backend
            await updateTask(removed._id, { status: destination.droppableId });
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: { ...column, items: copiedItems },
            });
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4 items-start h-full">
            <DragDropContext onDragEnd={onDragEnd}>
                {Object.entries(columns).map(([columnId, column], index) => {
                    return (
                        <div
                            className="flex-1 min-w-[300px] w-full"
                            key={columnId}
                        >
                            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center justify-between">
                                {column.name}
                                <span className="bg-[var(--bg-card)] text-[var(--text-secondary)] text-xs py-1 px-2 rounded-full border border-[var(--border-color)]">
                                    {column.items.length}
                                </span>
                            </h2>
                            <Droppable droppableId={columnId}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`p-4 rounded-xl min-h-[500px] transition-colors ${snapshot.isDraggingOver ? "bg-indigo-50/50 border-indigo-200" : "bg-[var(--bg-surface)] border border-[var(--border-color)]"
                                            }`}
                                    >
                                        {column.items.map((item, index) => (
                                            <Draggable key={item._id} draggableId={item._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`bg-[var(--bg-card)] p-4 rounded-lg shadow-sm mb-3 border border-[var(--border-color)] group hover:shadow-md transition-all ${snapshot.isDragging ? "rotate-2 shadow-xl ring-2 ring-indigo-500/20" : ""
                                                            }`}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                        }}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div title={`Priority ${item.priority.replace('p', '')}`}>
                                                                <Flag
                                                                    size={14}
                                                                    className={
                                                                        item.priority === 'p1' ? "fill-red-500 text-red-600" :
                                                                            item.priority === 'p2' ? "fill-amber-500 text-amber-600" :
                                                                                item.priority === 'p3' ? "fill-green-500 text-green-600" :
                                                                                    "text-slate-400"
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        {/* Title Row with Timer/Overdue */}
                                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                                            <p className="text-[var(--text-primary)] font-medium text-sm leading-snug">{item.title}</p>

                                                            {!item.completed && (
                                                                <>
                                                                    {/* Timer */}
                                                                    {item.duration > 0 && item.startTime && (
                                                                        <TimeTracker task={item} />
                                                                    )}
                                                                    {/* Overdue */}
                                                                    {item.dueDate && new Date(item.dueDate) < new Date().setHours(0, 0, 0, 0) && (
                                                                        <div className="flex items-center gap-1 bg-red-50 px-1.5 py-0.5 rounded text-red-600 border border-red-100 text-[10px]">
                                                                            <AlertCircle size={10} />
                                                                            <span>Overdue</span>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>

                                                        {item.dueDate && (
                                                            <div className="mt-2 flex items-center text-xs text-slate-400">
                                                                📅 {new Date(item.dueDate).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
