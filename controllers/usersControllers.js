const getUsers = (req, res) => {
    console.log(req.db)
    req.db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ users: rows });
    });
}

module.exports = {
    getUsers
}