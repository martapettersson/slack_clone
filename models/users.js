const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model for new users
const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	profilePic: {
		type: String,
		default: "/public/images/avatar.png",
	},
	password: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	online: {
		type: Boolean,
		default: false,
		required: true,
	},
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
