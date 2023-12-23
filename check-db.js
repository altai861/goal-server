const sqlite3 = require("sqlite3");

const db = new sqlite3.Database('./todo.db');

/*
db.run("INSERT INTO users (username, password) VALUES (?, ?)", ["Altai", "Aka12345678"], (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('User added');
})

db.run("INSERT INTO todos (todoTitle, date, userId) VALUES(?, ?, ?)", ["First coding workbout", "2023-12-22", 1], (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log("Inserted todo");
})
db.run("INSERT INTO todos (todoTitle, date, userId) VALUES(?, ?, ?)", ["Second coding workbout", "2023-12-22", 1], (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log("Inserted todo");
})
db.run("INSERT INTO todos (todoTitle, date, userId) VALUES(?, ?, ?)", ["Upper body training", "2023-12-22", 1], (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log("Inserted todo");
})
*/


db.all("SELECT * from users", (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log(rows);
    }
})

db.all("SELECT * from todos", (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log(rows);
    }
})
db.all("SELECT * from lists", (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log(rows);
    }
})


/*
db.run("DELETE from users", (err) =>{
    if (err) {
        console.log(err.message);
    } else {
        console.log("deleted");
    }
})
*/



db.close((err) => {
    if (err) {
      console.error('Error closing the database:', err.message);
    } else {
      console.log('Database closed.');
    }
  });


