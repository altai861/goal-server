const sqliteDB = require("../middleware/sqlite-middleware.js");

async function addTodo(req, res) {
  try {
    const userId = req.user.userId; // Assuming the user ID is stored in the JWT token
    const { todoTitle, listId, date } = req.body;
    if (!todoTitle) {
        return res.status(400).json({ success: false, message: "TodoTitle is required" })
    }
    // Add todo to the database
    const todoId = await sqliteDB.insertTodo(userId, todoTitle, listId, date);

    res.status(201).json({ success: true, message: 'Todo added successfully', todoId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function updateTodo(req, res) {
  try {
    const userId = req.user.userId; // Assuming the user ID is stored in the JWT token
    const todoId = req.params.todoId;
    const updateData = req.body;

    // Update todo in the database
    const success = await sqliteDB.updateTodo(userId, todoId, updateData);

    if (success) {
      res.json({ success: true, message: 'Todo updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Todo not found or not owned by the user' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function deleteTodo(req, res) {
  try {
    const userId = req.user.userId; // Assuming the user ID is stored in the JWT token
    const todoId = req.params.todoId;

    // Delete todo from the database
    const success = await sqliteDB.deleteTodo(userId, todoId);

    if (success) {
      res.json({ success: true, message: 'Todo deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Todo not found or not owned by the user' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function getTodo(req, res) {
  try {
    const userId = req.user.userId; // Assuming the user ID is stored in the JWT token

    // Get todos for the user from the database
    const todos = await sqliteDB.getTodos(userId);

    res.json({ success: true, todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = { addTodo, updateTodo, deleteTodo, getTodo };
