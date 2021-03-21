const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model for new users
const ChannelSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	private: {
		type: Boolean,
		default: false,
	},
	description: {
		type: String,
		maxlength: 1000,
	},
	date: {
		type: Date,
		default: new Date(),
	},
	messages: [{
		user : {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message : {
			type: String,
		},
		date: {
			type: Date,
			default: new Date(),
		},
	}],
});

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;
