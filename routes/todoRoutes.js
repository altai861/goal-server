const express = require("express");
const router = express.Router();
const todosControllers = require("../controllers/todoControllers")
const { authenticateUser } = require("../middleware/authenticateUser.js");

router.use(authenticateUser);

router.route('/')
    .post(todosControllers.addTodo)
    .get(todosControllers.getTodo);

router.route("/completed/:todoId")
    .get(todosControllers.changeCompleted)

router.route("/:todoId")
    .put(todosControllers.updateTodo)
    .delete(todosControllers.deleteTodo)

module.exports = router;