const express = require("express");
const router = express.Router();
const goalControllers = require("../controllers/goalController.js")
const verifyJWT = require("../middleware/verifyJWT.js");

router.use(verifyJWT);

router.route("/")
    .get(goalControllers.getGoal)
    .post(goalControllers.addGoal)
    .delete(goalControllers.deleteGoal)

router.route("/:id")
    .put(goalControllers.updateGoal)

module.exports = router;