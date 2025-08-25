import React, { useState, useEffect } from "react";
import api from "../api/axios";

const priorities = ["low", "medium", "high"];

export default function CreateTaskModal({ onClose, onTaskCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    dueDate: "",
    priority: "medium",
    assignedUsers: [],
  });

  const [allUsers, setAllUsers] = useState([]);

  // fetch all users for assignment
  useEffect(() => {
    api
      .get("/auth/users")
      .then((res) => setAllUsers(res.data))
      .catch((err) => console.error("Error fetching users", err));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    // console.log(form);
      const res = await api.post("/tasks", form);
      onTaskCreated(res.data);
      onClose();
    } catch (err) {
      console.error("Error creating task", err);
    }
  };

  const toggleUser = (id) => {
    setForm((prev) => ({
      ...prev,
      assignedUsers: prev.assignedUsers.includes(id)
        ? prev.assignedUsers.filter((u) => u !== id)
        : [...prev.assignedUsers, id],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Create Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            name="title"
            placeholder="Title"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />

          {/* Status */}
          <select
            name="status"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            value={form.status}
          >
            <option value="todo">To-Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Due Date */}
          <input
            type="date"
            name="dueDate"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />

          {/* Priority */}
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Assign Users */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign Users
            </label>
            <div className="flex flex-wrap gap-2">
              {allUsers.map((user) => (
                <button
                  type="button"
                  key={user._id}
                  onClick={() => toggleUser(user._id)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    form.assignedUsers.includes(user._id)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {user.name}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
