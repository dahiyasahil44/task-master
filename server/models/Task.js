const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    dueDate: { type: Date },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
    order: { type: Number, default: 0 },
    assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        text: String,
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
