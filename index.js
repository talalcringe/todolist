const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');

const Task = require('./models/task.model');

const app = express();

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected!');
    app.listen(3000, () => {
      console.log('Server running on port 3000!');
    });
  })
  .catch((err) => {
    console.log('MongoDB Connection Failed');
  });

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/task/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const updatedTask = await Task.findById(id);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/task/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
