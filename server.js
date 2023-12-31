require("dotenv").config();
const express = require("express");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logger")
const { connectToSQLite } = require("./middleware/dbConn");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
const port = 3500;


// These are allowed origins 
const allowedOrigins = ['http://localhost:5173', 'https://altai861.github.io'];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the list of allowed origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Using the logger middleware
app.use(logger);
app.use(cors(corsOptions));

// Using the sqlite connection middleware
app.use(connectToSQLite)
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")))

app.use("/", require("./routes/root.js"))
app.use("/users", require("./routes/usersRoutes.js"));
app.use("/auth", require("./routes/authRoutes.js"))
app.use("/todo", require("./routes/todoRoutes.js"));
app.use("/list", require("./routes/listRoutes.js"))

app.listen(port, function () {
    console.log("Server is running on port 3500");
})
