const express = require('express');
const auth = require('../middlewares/auth');
const { createTask, getTasks, getAllTasks, getTask, updateTask, deleteTask, assignUsers, addComment } = require('../controllers/taskController');

const router = express.Router();

router.post('/', auth, createTask);
// router.get('/', auth, getTasks);
router.get('/:id', auth, getTask);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);
router.get("/", auth, getAllTasks);

// assign users
router.put('/:id/assign', auth, assignUsers);

// add comment
router.post('/:id/comments', auth, addComment);

module.exports = router;
