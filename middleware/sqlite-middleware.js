const sqlite3 = require("sqlite3").verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, "..", "todo.db"));

function insertUser(username, password) {
    return new Promise((resolve, reject) => {
      // Check if the username already exists
      const checkUsernameQuery = 'SELECT COUNT(*) as count FROM users WHERE username = ?';
  
      db.get(checkUsernameQuery, [username], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
  
        const usernameExists = row && row.count > 0;
  
        if (usernameExists) {
          // Username already exists, reject the promise
          resolve({ success: false, message: 'Username already exists' });
        } else {
          // Username does not exist, proceed with the insertion
          const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
          db.run(insertUserQuery, [username, password], function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(this.lastID);
            }
          });
        }
      });
    });
  }
  

function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
        
        const query = 'SELECT * FROM users where username = ?';
        db.get(query, [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                console.log(row)
                resolve(row);
            }
        })
    })

}
function getUserByUserId(userId) {
    return new Promise((resolve, reject) => {
        
        const query = 'SELECT * FROM users where userId = ?';
        db.get(query, [userId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                console.log(row)
                resolve(row);
            }
        })
    })

}

function insertTodo(userId, todoTitle, listId, date) {
    return new Promise((resolve, reject) => {
      // Build the INSERT query dynamically based on provided values
      const columns = ['todoTitle', 'userId'];
      const values = [todoTitle, userId];
  
      if (listId !== undefined) {
        columns.push('listId');
        values.push(listId);
      }
  
      if (date !== undefined) {
        columns.push('date');
        values.push(date);
      }
  
      const placeholders = new Array(columns.length).fill('?').join(', ');
  
      const query = `INSERT INTO todos (${columns.join(', ')}) VALUES (${placeholders})`;
  
      db.run(query, values, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }
  

function updateTodo(userId, todoId, updateData) {
    return new Promise((resolve, reject) => {
        const { todoTitle, listId, date, completed } = updateData;

        const setClauses = [];
        const values = [];

        if (todoTitle !== undefined) {
            setClauses.push('todoTitle = ?');
            values.push(todoTitle);
        }

        if (listId !== undefined) {
            setClauses.push('listId = ?');
            values.push(listId);
        }

        if (date !== undefined) {
            setClauses.push('date = ?');
            values.push(date);
        }

        if (completed !== undefined) {
            setClauses.push('completed = ?');
            values.push(completed);
        }

        if (setClauses.length === 0) {
            reject(new Error('No valid update values provided'));
            return;
        }

        values.push(todoId, userId);

        const setClause = setClauses.join(", ");
        const query = `UPDATE todos SET ${setClause} WHERE todoId = ? AND userId = ?`;

        db.run(query, values, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes > 0);
            }
        })
    })
}

function deleteTodo(userId, todoId) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM todos WHERE todoId = ? AND userId = ?';

        db.run(query, [todoId, userId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes > 0);
            }
        })
    })
}

function getTodos(userId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM todos WHERE userId = ?';
      db.all(query, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows); // Resolve with the todos
        }
      });
    });
  }

//////////////////////////////////////////////////
// List functions

function addList(userId, title) {
    return new Promise((resolve, reject) => {
        // Build the INSERT query dynamically based on provided values
        
        const query = `INSERT INTO lists (title, userId) VALUES (?, ?)`;
    
        db.run(query, [title, userId], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        });
      });
}

function changeListTitle(userId, listId, title) {
    return new Promise((resolve, reject) => {
        const query = `UPDATE lists SET title = ? WHERE userId = ? AND listId = ?`;

        db.run(query, [title, userId, listId], function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(this.changes > 0);
            }
        })
    })
}

function deleteList(userId, listId) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM lists WHERE listId = ? AND userId = ?';

        db.run(query, [listId, userId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes > 0);
            }
        })
    })
}

function getLists(userId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM lists WHERE userId = ?';
        db.all(query, [userId], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows); // Resolve with the todos
          }
        });
      });
}

module.exports = { 
    insertUser, 
    getUserByUsername,
    getUserByUserId,
    insertTodo,
    updateTodo, 
    deleteTodo,
    getTodos,
    addList,
    changeListTitle,
    deleteList,
    getLists
}