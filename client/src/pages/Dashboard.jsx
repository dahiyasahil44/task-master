import { useEffect, useMemo, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import KanbanColumn from "../components/KanbanColumn";
import CreateTaskModal from "../components/CreateTaskModal";

const STATUS = {
  todo: { key: "todo", title: "To-Do" },
  inProgress: { key: "in-progress", title: "In Progress" },
  completed: { key: "completed", title: "Completed" },
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // fetch tasks
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/tasks");
        if (mounted) setTasks(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const columns = useMemo(() => {
    return {
      [STATUS.todo.key]: tasks
        .filter((t) => t.status === STATUS.todo.key)
        .sort((a, b) => a.order - b.order),
      [STATUS.inProgress.key]: tasks
        .filter((t) => t.status === STATUS.inProgress.key)
        .sort((a, b) => a.order - b.order),
      [STATUS.completed.key]: tasks
        .filter((t) => t.status === STATUS.completed.key)
        .sort((a, b) => a.order - b.order),
    };
  }, [tasks]);

  const onDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;
    if (sourceCol === destCol && source.index === destination.index) return;

    // update order
    const updatedTasks = [...tasks];
    const movedTask = updatedTasks.find((t) => t._id === draggableId);
    if (!movedTask) return;

    movedTask.status = destCol;
    movedTask.order = destination.index;

    // adjust order of tasks in the same column
    updatedTasks
      .filter((t) => t._id !== draggableId && t.status === destCol)
      .sort((a, b) => a.order - b.order)
      .forEach((t, idx) => (t.order = idx >= destination.index ? idx + 1 : idx));

    setTasks([...updatedTasks]);

    try {
      await api.put(`/tasks/${draggableId}`, {
        status: destCol,
        order: movedTask.order,
      });
    } catch (err) {
      console.error("Failed to update status/order", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-x-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Task Board</h2>
            <p className="text-sm text-gray-600">
              Drag tasks between columns to update status.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + New Task
          </button>
        </div>

        {loading ? (
          <div className="text-gray-500">Loading tasks…</div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4">
              <KanbanColumn
                droppableId={STATUS.todo.key}
                title={STATUS.todo.title}
                tasks={columns[STATUS.todo.key]}
              />
              <KanbanColumn
                droppableId={STATUS.inProgress.key}
                title={STATUS.inProgress.title}
                tasks={columns[STATUS.inProgress.key]}
              />
              <KanbanColumn
                droppableId={STATUS.completed.key}
                title={STATUS.completed.title}
                tasks={columns[STATUS.completed.key]}
              />
            </div>
          </DragDropContext>
        )}

        {showModal && (
          <CreateTaskModal
            onClose={() => setShowModal(false)}
            onTaskCreated={(newTask) => setTasks((prev) => [...prev, newTask])}
          />
        )}
      </main>
    </div>
  );
}
