const sqliteDB = require("../middleware/sqlite-middleware.js");

async function addList(req, res) {
    try {
        const userId = req.user.userId;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "List title is required" })
        }

        const listId = await sqliteDB.addList(userId, title);

        res.status(201).json({ success: true, message: 'List added successfully', listId });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error while inserting list" });
    }
}

async function updateList(req, res) {
    try {
        const userId = req.user.userId;
        const listId = req.params.listId;
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, message: "Nothing to update" });
        }

        const success = await sqliteDB.changeListTitle(userId, listId, title);

        if (success) {
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
        const userId = req.user.userId; // Assuming the user ID is stored in the JWT token
        const listId = req.params.listId;
    
        // Delete todo from the database
        const success = await sqliteDB.deleteList(userId, listId);
    
        if (success) {
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
        const userId = req.user.userId; // Assuming the user ID is stored in the JWT token
    
        // Get todos for the user from the database
        const lists = await sqliteDB.getLists(userId);
    
        res.json({ success: true, lists });
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