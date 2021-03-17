const express = require("express");
const router = express.Router();
const Channel = require("../models/channels");
const ChannelMessage = require("../models/channel_messages");
const { ensureAuthenticated } = require("../config/auth");

/********** CHANNELS ***********/

router.get("/read", ensureAuthenticated, (req, res) => {
	Channel.find().exec((error, channels) => {
		if (error) {
			return handleError(error);
		} else {
			res.send(channels);
		}
	});
});

router.post("/create", ensureAuthenticated, (req, res) => {
	let new_channel = new Channel({
		name: req.body.name,
		description: req.body.description,
	});
	try {
		new_channel.save((err) => {
			if (err) {
				console.log(err);
				res.status(500).json({
					message: "This channel already exists! Choose a different name!",
				});
			} else {
				res.status(200).json({ message: "Channel was added!" });
			}
		});
	} catch (error) {
		console.log(error);
	}
});

router.get("/:id", (req, res) => {
	Channel.findById({
		_id: req.params.id,
	})
    .populate("messages.user")
    .exec((error, channel) => {
		if (error) {
			return handleError(error);
		}
		res.json(channel);
	});
});

/********** CHANNEL MESSAGES ***********/

router.put("/new-message", (req, res) => {
	let new_message = {
		user: req.user._id,
		message: req.body.message,
	};

	Channel.findByIdAndUpdate(
		req.body.channelId,
		{ $push: { messages: new_message } },
		(error) => {
			if (error) {
				return handleError(error);
			}
			res.send({ message: new_message.message, user: req.user.name });
		}
	);
});

module.exports = router;
