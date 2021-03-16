const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChannelMessageSchema = new Schema({
	// channel: ,
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	date: {
		type: Date,
		default: Date.now,
	},
	message: {
		type: String,
		minlength: 1,
		maxlength: 1000,
		required: true,
	},
});

// ChannelMessageSchema.virtual("url").get(() => {
// 	return `/catalog/genre/${this._id}`;
// });

module.exports = mongoose.model("ChannelMessage", ChannelMessageSchema);
