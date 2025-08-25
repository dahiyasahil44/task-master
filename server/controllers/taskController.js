const Task = require('../models/Task');

// Create a task
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tasks (user-specific for now, admin sees all)
exports.getTasks = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const tasks = await Task.find(filter).populate('assignedUsers', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role !== 'admin') {
      filter = { createdBy: req.user._id };
    }

    const tasks = await Task.find(filter).populate('assignedUsers', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tasks created by user OR assigned to user
exports.getAllTasks = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role !== 'admin') {
      filter = {
        $or: [
          { createdBy: req.user._id },
          { assignedUsers: req.user._id }
        ]
      };
    }

    const tasks = await Task.find(filter)
      .populate('assignedUsers', 'name email')
      .populate('createdBy', 'name email');

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: err.message });
  }
};


// Get single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedUsers', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // check ownership or admin
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this task' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // check ownership or admin
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // check ownership or admin
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign users to a task
exports.assignUsers = async (req, res) => {
  try {
    const { userIds } = req.body; // array of user IDs
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Only creator or admin can assign
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to assign users' });
    }

    task.assignedUsers = userIds;
    await task.save();

    res.json(await task.populate('assignedUsers', 'name email'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Only creator, assigned users, or admin can comment
    const isAssigned = task.assignedUsers.some(
      (u) => u.toString() === req.user._id.toString()
    );

    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      !isAssigned
    ) {
      return res.status(403).json({ message: 'Not authorized to comment on this task' });
    }

    task.comments.push({ text, author: req.user._id });
    await task.save();
    await task.populate('comments.author', 'name email');
    res.json(task.comments);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
