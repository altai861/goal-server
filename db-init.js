const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./todo.db');

db.run(`
    CREATE TABLE IF NOT EXISTS users (
        userId INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
    )
`);


db.run(`
    create table if not exists lists (
        listId INTEGER primary key autoincrement,
        title TEXT NOT NULL,
        userId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(userId)
    )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS todos (
        todoId INTEGER PRIMARY KEY AUTOINCREMENT,
        todoTitle TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        date DATE,
        listId INTEGER,
        userId INTEGER NOT NULL,
        FOREIGN KEY (listId) references lists(listId),
        FOREIGN KEY (userId) references users(userId)
    )
`)


db.close((err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Databas initialization complete.");
    }
})