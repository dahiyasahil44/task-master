import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

export default function KanbanColumn({ droppableId, title, tasks }) {
  return (
    <div className="flex-1 min-w-[300px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <span className="text-xs text-gray-500">{tasks.length}</span>
      </div>

      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`rounded-2xl p-3 min-h-[200px] border ${
              snapshot.isDraggingOver ? "bg-green-50 border-green-200" : "bg-gray-50 border-transparent"
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable draggableId={task._id} index={index} key={task._id}>
                {(providedDrag, snapshotDrag) => (
                  <div
                    ref={providedDrag.innerRef}
                    {...providedDrag.draggableProps}
                    {...providedDrag.dragHandleProps}
                    className={`mb-3 ${snapshotDrag.isDragging ? "rotate-1" : ""}`}
                  >
                    <TaskCard task={task} />
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
}
