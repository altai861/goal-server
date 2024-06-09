const List = require("../models/List.js")
const User = require("../models/User.js")


async function addList(req, res) {
    try {
        const userId = req.userId;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "List title is required" })
        }

        const newList = new List({
            title,
            userId
        })

        const savedList = await newList.save();

        res.status(201).json({ success: true, message: 'List added successfully', savedList });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error while inserting list" });
    }
}

async function updateList(req, res) {
    try {
        const listId = req.params.listId;
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, message: "Nothing to update" });
        }

        const foundList = await List.findById(listId).exec();
        foundList.title = title
        const savedList = await foundList.save();

        if (savedList) {
            res.json({ success: true, message: 'List updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'List not found or not owned by the user' });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function deleteList(req, res) {
    try {
        const userId = req.userId; // Assuming the user ID is stored in the JWT token
        const listId = req.params.listId;
    
        // Delete todo from the database
        const foundList = await List.findById(listId);
        const deletedList = await foundList.deleteOne();

        if (deleteList) {
          res.json({ success: true, message: 'List deleted successfully' });
        } else {
          res.status(404).json({ success: false, message: 'Todo not found or not owned by the user' });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
}

async function getLists(req, res) {
    try {
        const userId = req.userId; // Assuming the user ID is stored in the JWT token
        const user = await User.findById(userId).exec();
        // Get todos for the user from the database
        const lists = await List.find({ userId: userId }).lean();
        if (lists) {
            res.json({ success: true, lists, username: user.username });

        } else {
            res.json({ success: false, lists, username: user.username });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
}

module.exports = {
    addList,
    updateList,
    deleteList,
    getLists
}