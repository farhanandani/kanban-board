import PlusIcon from "../icons/PlusIcon"
import { useMemo, useState } from "react"
import { Column, Id, Task } from "../type";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
    const [activeColumns, setActiveColumns] = useState<Column | null>(null);
    const [task, setTask] = useState<Task[]>([]);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        })
    )

    return (
        <div className="
            m-auto
            flex
            min-h-screen
            w-full
            items-center
            overflow-x-auto
            overflow-y-hidden
            px-[40px]
        ">
            <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
            >
                <div className="m-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {columns.map((col) => (
                                <ColumnContainer
                                    column={col}
                                    key={col.id}
                                    deletedColumn={deletedColumn}
                                    updateColumn={updateColumn}
                                    createTask={createTask}
                                    task={task.filter(task => task.columnId === col.id)}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                />
                            ))}
                        </SortableContext>
                        <button
                            onClick={() => {
                                createColumn();
                            }}

                            className="
                        h-[60px]
                        w-[35px]
                        min-w-[350px]
                        cursor-pointer
                        rounded-lg
                        bg-mainBackgroundColor
                        border-2
                        border-columnBackgroundColor
                        p-4
                        ring-purple-500
                        hover:ring-2
                        flex gap-2
                        ">
                            <PlusIcon />   Add Column
                        </button>
                    </div>
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeColumns && (
                            <ColumnContainer
                                column={activeColumns}
                                deletedColumn={deletedColumn}
                                updateColumn={updateColumn}
                                createTask={createTask}
                                task={task.filter(task => task.columnId === activeColumns.id)}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                            />
                        )}
                        {
                            activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />
                        }
                    </DragOverlay>, document.body)}

            </DndContext>
        </div >
    );

    function createColumn() {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`,
        }

        setColumns([...columns, columnToAdd])
    }

    function deletedColumn(id: Id) {
        const filterColumns = columns.filter((col) => col.id !== id);
        setColumns(filterColumns);

        const newTask = task.filter((task) => task.columnId !== id);
        setTask(newTask);
    }

    function updateColumn(id: Id, title: string) {
        const newColumns = columns.map(col => {
            if (col.id !== id) return col;
            return { ...col, title }
        })

        setColumns(newColumns);
    }

    function createTask(columnId: Id) {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Task ${task.length + 1}`,
        }
        setTask([...task, newTask])
    }

    function deleteTask(id: Id) {
        const filterTask = task.filter((task) => task.id !== id);
        setTask(filterTask);
    }

    function updateTask(id: Id, content: string) {
        const newTask = task.map((task) => {
            if (task.id !== id) return task;
            return { ...task, content }
        })
        setTask(newTask);
    }

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Columns") {
            setActiveColumns(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;

        if (!over) return;
        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isoverATask = over.data.current?.type === "Task";

        if (!isActiveATask) return;

        if (isActiveATask && isoverATask) {
            setTask(task => {
                const activeTaskIndex = task.findIndex((task) => task.id === active.id);
                const overTaskIndex = task.findIndex((task) => task.id === over.id);
                task[activeTaskIndex].columnId = task[overTaskIndex].columnId;
                return arrayMove(task, activeTaskIndex, overTaskIndex);
            })
        }

        const isOverAColumn = over.data.current?.type === "Columns";

        if (isActiveATask && isOverAColumn) {
            setTask(task => {
                const activeTaskIndex = task.findIndex((task) => task.id === active.id);
                const overTaskIndex = task.findIndex((task) => task.id === over.id);
                task[activeTaskIndex].columnId = over.id;
                return arrayMove(task, activeTaskIndex, overTaskIndex);
            })
        }

    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumns(null);
        setActiveTask(null);
        const { active, over } = event;

        if (!over) return;
        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) return;

        setColumns(columns => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeColumnId);
            const overColumnIndex = columns.findIndex((col) => col.id === overColumnId);
            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        })
    }

}

function generateId() {
    return Math.floor(Math.random() * 10001);
}

export default KanbanBoard