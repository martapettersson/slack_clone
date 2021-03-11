const express = require("express");
const app = express();
const expressEjsLayout = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const router = express.Router;
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

//DB
mongoose
	.connect("mongodb://localhost:27017/slack_clone_db")
	.then(() => console.log("Connected to DB"))
	.catch((error) => console.log(error));

//EJS
app.set("view engine", "ejs");
app.use(expressEjsLayout);

//Public static files
app.use("/public", express.static(path.join(__dirname, "public")));

//To use body-parser
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/", indexRouter);
app.use("/users/", usersRouter);

app.listen(3000);
