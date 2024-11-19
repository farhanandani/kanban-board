import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../type";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
    column: Column;
    deletedColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;
    createTask: (columnId: Id) => void;
    task: Task[]
    deleteTask: (id: Id) => void
    updateTask: (id: Id, content: string) => void
}

function ColumnContainer(props: Props) {
    const { column, deletedColumn, updateColumn, createTask, task, deleteTask, updateTask } = props;
    const [editMode, setEditMode] = useState(false);

    const taskIds = useMemo(() => task.map((task) => task.id), [task]);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({
            id: column.id,
            data: {
                type: "Columns",
                column,
            },
            disabled: editMode,
        });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return <>
            <div
                ref={setNodeRef}
                style={style}
                className=" 
                bg-gray-900
                w-[300px]
                h-[500px]
                max-h-[500px]
                rounded-md
                border-2
                border-pink-800
                opacity-50
                flex
                flex-col"
            ></div>
        </>
    }

    return <div
        ref={setNodeRef}
        style={style}
        className=" 
    bg-gray-400
    w-[300px]
    h-[500px]
    max-h-[500px]
    rounded-md
    flex
    flex-col">
        {/* Column Title */}
        <div
            {...attributes}
            {...listeners}
            onClick={() => setEditMode(true)}
            className="
        bg-gray-900
        text-md
        h-[60px]
        cursor-grab
        rounded-md
        rounded-b-none
        p-3
        font-bold
        border-gray-800
        border-4
        flex
        items-center
        justify-between
        "
        >
            <div className="flex gap-2">
                <div className="
            flex
            justify-center
            items-center
            bg-gray-700
            px-2
            py-1
            text-sm
            rounded-full
            "
                >
                    0
                </div>
                {!editMode && column.title}
                {editMode &&
                    <input
                        className="bg-gray-700 focus:border-pink-700 border-rounded"
                        value={column.title}
                        onChange={e => updateColumn(column.id, e.target.value)}
                        autoFocus
                        onBlur={() => setEditMode(false)}
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                setEditMode(false);
                            }
                        }} />}
            </div>
            <button
                onClick={() => {
                    deletedColumn(column.id)
                }}
                className="
            stroke-pink-200
            hover:stroke-pink-600
            hover:bg-slate-500
            rounded
            px-1
            py-1
            ">
                <TrashIcon />
            </button>
        </div>
        {/* Content */}
        <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">{
            <SortableContext items={taskIds}>
                {task.map(task => (
                    <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
                ))}
            </SortableContext>
        }
        </div>
        {/* Footer */}
        <button
            onClick={() => {
                createTask(column.id);
            }}
            className="
            flex
            gap-2
            justify-center
            items-center
            bg-gray-700
            px-2
            py-1
            text-sm
            rounded-md
            text-gray-100
            border-2
            border-gray-300
            border-spacing-1
            "><PlusIcon />Add task</button>
    </div>
}

export default ColumnContainer