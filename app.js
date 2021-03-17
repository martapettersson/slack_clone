const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const expressEjsLayout = require("express-ejs-layouts");

const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const channelsRouter = require("./routes/channels");

require("./config/passport")(passport);

// DB
mongoose
	.connect("mongodb://localhost:27017/slack_clone_db")
	.then(() => console.log("Connected to DB"))
	.catch((error) => console.log(error));

// EJS
app.set("view engine", "ejs");
app.use(expressEjsLayout);

// Public static files
app.use("/public", express.static(path.join(__dirname, "public")));

//JSON
app.use(express.json());

// To use body-parser
app.use(express.urlencoded({ extended: true }));

// Sessions, for flash
app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true,
	})
);

// Passport
app.use(passport.initialize());
// So we can save our user data in a session
app.use(passport.session());

// Flash, send messages
app.use(flash());
app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});

// Routes
app.use("/", indexRouter);
app.use("/users/", usersRouter);
app.use("/channels/", channelsRouter);

// SOCKET
io.on("connection", (socket) => {
	// every "user" has one socket each
	console.log("user connected");

	//broadcast
	socket.on("newChannelMessage", (message) => {
		io.emit("newChannelMessage", message);
	});

	socket.on("userOnline", (user) => {
		io.emit("userOnline", user);
	});

	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

http.listen(3000);
