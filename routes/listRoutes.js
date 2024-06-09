const express = require("express");
const router = express.Router();
const listControllers = require("../controllers/listControllers.js");
const verifyJWT = require("../middleware/verifyJWT.js");

router.use(verifyJWT)

router.route("/")
    .post(listControllers.addList)
    .get(listControllers.getLists)

router.route("/:listId")
    .put(listControllers.updateList)
    .delete(listControllers.deleteList)

module.exports = router;