const Todo = require("../models/Todo.js");
const User = require("../models/User.js")

async function addTodo(req, res) {
  try {
    const userId = req.user.userId; // Assuming the user ID is stored in the JWT token
    const { todoTitle, listId, date } = req.body;
    if (!todoTitle) {
        return res.status(400).json({ success: false, message: "TodoTitle is required" })
    }
    // Add todo to the database
    const newTodo = new Todo({
      todoTitle,
      userId
    });

    if (listId) newTodo.listId = listId
    if (date) newTodo.date = date

    await newTodo.save();

    res.status(201).json({ success: true, message: 'Todo added successfully', newTodo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function updateTodo(req, res) {
  try {
    const userId = req.user.userId; // Assuming the user ID is stored in the JWT token
    const todoId = req.params.todoId;
    const updateData = req.body;

    // Update todo in the database
    const foundTodo = await Todo.findById(todoId).exec();

    if (foundTodo) {
      if (updateData.todoTitle) foundTodo.todoTitle = updateData.todoTitle
      if (updateData.listId) foundTodo.listId = updateData.listId
      if (updateData.date) foundTodo.date = updateData.date
      if (updateData.completed) foundTodo.completed = updateData.completed

      const savedTodo = await foundTodo.save();

      
      return res.status(201).json({ message: "Updated todo", todo: savedTodo })
      
    } else {
      return res.status(400).json({ message: "Todo not found" })
    }

    
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function deleteTodo(req, res) {
  try {
    const userId = req.user.userId; // Assuming the user ID is stored in the JWT token
    const todoId = req.params.todoId;

    // Delete todo from the database
    const foundTodo = await Todo.findById(todoId).exec();
    if (!foundTodo) return res.status(400).json({ message: 'Todo not found' })

    const deletedTodo = await foundTodo.deleteOne();

    return res.status(201).json({ message: "Deleted todo ", deleteTodo })
    
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function getTodo(req, res) {
  try {
    const userId = req.user.userId; // Assuming the user ID is stored in the JWT token

    // Get todos for the user from the database
    const todos = await Todo.find({ userId }).lean();

    res.json({ success: true, todos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = { addTodo, updateTodo, deleteTodo, getTodo };
