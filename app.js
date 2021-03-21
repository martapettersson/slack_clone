const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const expressEjsLayout = require("express-ejs-layouts");

const path = require("path");
const fileUpload = require("express-fileupload");
const fs = require("fs");
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

// FILEUPLOAD
app.use(
	fileUpload({
		createParentPath: true,
		// limits: {
		// 	files: 1,
		// 	fileSize: 5 * 1024 * 1024,
		// },
	})
);

// Static files
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

const formatMessage = require("./utils/message");
const botName = "Slack Bot";
const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
} = require("./utils/users");
// SOCKET
io.on("connection", (socket) => {
	socket.on("joinRoom", ({ userName, roomId }) => {
		const user = userJoin(socket.id, userName, roomId);
		socket.join(user.room);

		// Welcome
		socket.emit("message", formatMessage(botName, "Welcome!"));

		// Broadcast when a user connects
		socket.broadcast
			.to(user.room)
			.emit(
				"message",
				formatMessage(botName, `${user.username} has joined the chat`)
			);

		// Send users and room info
		io.to(user.room).emit("roomUsers", {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});

	// Listen for channelMessage
	socket.on("channelMessage", (msg) => {
		const user = getCurrentUser(socket.id);
		console.log(user);
		io.to(user.room).emit("message", formatMessage(user.username, msg));
	});

	// Client disconnects
	socket.on("disconnect", () => {
		const user = userLeave(socket.id);
		if (user) {
			io.to(user.room).emit(
				"message",
				formatMessage(botName, `${user.username} has left the chat`)
			);

			// Send users and room info
			io.to(user.room).emit("roomUsers", {
				room: user.room,
				users: getRoomUsers(user.room),
			});
		}
	});
});

http.listen(3000);
