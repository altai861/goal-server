const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/usersControllers")

router.route("/")
    .get(usersControllers.getUsers)

module.exports = router;