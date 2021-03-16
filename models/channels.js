const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model for new users
const ChannelSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	messages: [
		{
			type: Schema.Types.ObjectId,
			ref: "ChannelMessage",
		},
	],
});

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;
