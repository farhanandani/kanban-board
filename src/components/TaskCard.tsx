import { useState } from "react"
import TrashIcon from "../icons/TrashIcon"
import { Id, Task } from "../type"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"

interface Props {
    task: Task;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({
            id: task.id,
            data: {
                type: "Task",
                task,
            },
            disabled: editMode,
        });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    const toggleEditMode = () => {
        setEditMode((prev) => !prev);
        setMouseIsOver(false);
    }

    if (isDragging) {
        return <div
            ref={setNodeRef}
            style={style}
            className="
        bg-gray-300
        flex
        p-2.5
        h-[100px]
        min-h-[100px]
        items-center
        rounded-lg
        border-2
        border-pink-400
        cursor-grab
        opacity-40
        relative"
        />;
    }

    if (editMode) {
        return <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="
        bg-gray-300
        flex
        p-2.5
        h-[100px]
        min-h-[100px]
        items-center
        rounded-lg
        hover: ring-2
        hover:ring-pink-400
        hover: ring-inset
        cursor-grab
        relative
        ">
            <textarea
                className="
            h-[90%]
            w-full resize-none
            border-none bg-transparent text-black
            focus-ouline-none
            "
                value={task.content}
                autoFocus
                placeholder="Enter task content"
                onBlur={toggleEditMode}
                onKeyDown={e => {
                    if (e.key === "Enter" && e.shiftKey) toggleEditMode();
                }}
                onChange={(e) => updateTask(task.id, e.target.value)}
            ></textarea>
        </div >;
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={toggleEditMode}
            onMouseEnter={() => {
                setMouseIsOver(true)
            }}
            onMouseLeave={() => {
                setMouseIsOver(false)
            }}
            className="
        bg-gray-300
        flex
        p-2.5
        h-[100px]
        min-h-[100px]
        items-center
        rounded-lg
        hover: ring-2
        hover:ring-pink-400
        hover: ring-inset
        cursor-grab
        relative
        task
        ">
            <p className="
            my-auto
            h-[90%]
            w-full
            overflow-y-auto
            overflow-x-auto
            whitespace-pre-wrap
            ">
                {task.content}</p>
            {mouseIsOver && (< button
                onClick={() => {
                    deleteTask(task.id)
                }}
                className="
            stroke-slate-300
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            bg-slate-400
            rounded p-2
            opacity-50
            hover:opacity-100
            ">
                <TrashIcon />
            </button>)}
        </div >
    )
}

export default TaskCard