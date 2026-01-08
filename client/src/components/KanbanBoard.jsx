import { useContext, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { TaskContext } from "../context/TaskContext";
import { isToday, isFuture, isValid } from "date-fns";
import KanbanTaskCard from "./KanbanTaskCard";

const KanbanBoard = ({ filterType = "all", filters, tasks: propTasks }) => {
    const { tasks: contextTasks, updateTask } = useContext(TaskContext);
    const tasks = propTasks || contextTasks;
    const [columns, setColumns] = useState({
        todo: { name: "To Do", items: [], color: "bg-slate-50 dark:bg-slate-900/50", accent: "indigo" },
        doing: { name: "In Progress", items: [], color: "bg-blue-50 dark:bg-blue-900/20", accent: "blue" },
        done: { name: "Done", items: [], color: "bg-green-50 dark:bg-green-900/20", accent: "emerald" },
    });

    useEffect(() => {
        if (tasks) {
            // Apply Global Filters First
            const filteredTasks = tasks.filter(task => {
                // 1. Date Logic
                if (filterType === "all") {
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
                    return task.completed;
                }

                // 2. Priority Logic
                if (filters && filters.priority !== "all" && task.priority !== filters.priority) {
                    return false;
                }

                return true;
            });

            setColumns({
                todo: { ...columns.todo, items: filteredTasks.filter((t) => !t.status || t.status === "todo") },
                doing: { ...columns.doing, items: filteredTasks.filter((t) => t.status === "doing") },
                done: { ...columns.done, items: filteredTasks.filter((t) => t.status === "done") },
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
                            className="flex-1 min-w-[300px] w-full flex flex-col h-full max-h-[calc(100vh-200px)]"
                            key={columnId}
                        >
                            {/* Column Header */}
                            <div className={`
                                mb-3 p-3 rounded-xl flex items-center justify-between border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm
                                ${columnId === 'todo' ? 'border-l-4 border-l-indigo-500' :
                                    columnId === 'doing' ? 'border-l-4 border-l-blue-500' :
                                        'border-l-4 border-l-green-500'}
                            `}>
                                <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wide">
                                    {column.name}
                                </h2>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${columnId === 'todo' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' :
                                    columnId === 'doing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                                        'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                                    }`}>
                                    {column.items.length}
                                </span>
                            </div>

                            {/* Droppable Area */}
                            <Droppable droppableId={columnId}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`
                                            flex-1 p-3 rounded-2xl transition-all overflow-y-auto custom-scrollbar border
                                            ${snapshot.isDraggingOver ? "bg-[var(--bg-surface)] border-indigo-300 ring-2 ring-indigo-500/10" : `border-transparent ${column.color}`}
                                        `}
                                    >
                                        {column.items.map((item, index) => (
                                            <Draggable key={item._id} draggableId={item._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <KanbanTaskCard
                                                        task={item}
                                                        provided={provided}
                                                        snapshot={snapshot}
                                                    />
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
