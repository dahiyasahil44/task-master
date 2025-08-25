import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function TaskCard({ task }) {
    const { user: currentUser } = useContext(AuthContext);

    // console.log(currentUser, task);

  const isAssigned =
    task.assignedUsers &&
    task.assignedUsers.some((u) => u._id === currentUser.id);

  return (
    <div className="rounded-xl border bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between">
        <h4 className="font-semibold text-gray-800">{task.title}</h4>

        {/* Priority Badge */}
        <span
          className={`text-xs px-2 py-0.5 rounded-full capitalize ${
            task.priority?.toLowerCase() === "high"
              ? "bg-red-100 text-red-700"
              : task.priority?.toLowerCase() === "medium"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {task.priority}
        </span>
      </div>

      {/* Description */}
      {task.description ? (
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {task.description}
        </p>
      ) : null}

      {/* Due Date */}
      {task.dueDate ? (
        <p className="mt-2 text-xs text-gray-500">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      ) : null}

      {/* Creator Info */}
      {task.createdBy && (
        <p className="mt-2 text-xs text-gray-500">
          Created by: <span className="font-medium">{task.createdBy.name}</span>
        </p>
      )}

      {/* Assigned Badge */}
      {isAssigned && (
        <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
          Assigned to you
        </span>
      )}
    </div>
  );
}
