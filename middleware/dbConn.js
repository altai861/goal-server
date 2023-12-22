const sqlite3 = require("sqlite3").verbose();

const connectToSQLite = (req, res, next) => {
    const db = new sqlite3.Database("./todo.db");
    req.db = db;

    res.on('finish', () => {
        db.close((err) => {
            if (err) {
                console.error("Error closing the database: ", err.message);
            }
        })
    })

    next();
} 

module.exports = {
    connectToSQLite
}

