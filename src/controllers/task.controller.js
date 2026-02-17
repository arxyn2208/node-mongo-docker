const Task = require('../models/tasks');

const createtask = async function (req, res) {
    try {
        const {title, description, completed} = req.body;
        const userId = req.user.userId;

        const count = await Task.countDocuments({ user: userId }); // count existing tasks

        const newtask = await Task.create({title, description, completed, user: userId, order: count});
        res.status(201).json(newtask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getAlltasks = async function (req, res) {
    try {
        const userId = req.user.userId;
        const tasks = await Task.find({ userId }).sort({ order: 1 });
        res.status(200).json(tasks);
    
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const gettaskbyid = async function (req, res) {
    try {
        const userId = req.user.userId;
        const taskId = req.params.id;
        const task = await Task.findOne({_id: taskId, userId});
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const updatetask = async function(req, res) {
    try {
        const userId = req.user.userId;
        const taskId = req.params.id;
        const { title, description, completed } = req.body;
        const updatedtask = await Task.findOneAndUpdate(
            { _id: taskId, userId },
            { title, description, completed },
            { new: true }
        );
        if (!updatedtask)
{            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(updatedtask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const deletetask = async function(req, res) {
    try {
        const userId = req.user.userId;
        const taskId = req.params.id;
        const deletedtask = await Task.findOneAndDelete({ _id: taskId, userId });
        if (!deletedtask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully', task: deletedtask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const reorderTasks = async (req, res) => {
    try {
        const { orderedIds } = req.body;
        
        const updates = orderedIds.map((id, index) =>
            Task.findOneAndUpdate({ _id: id, user: req.user.id }, { order: index })
        );
        
        await Promise.all(updates);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ← ADD THIS: Export all functions
module.exports = {
    createtask,
    getAlltasks,
    gettaskbyid,
    updatetask,
    deletetask,
    reorderTasks
};