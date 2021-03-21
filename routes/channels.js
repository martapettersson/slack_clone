const express = require("express");
const router = express.Router();
const Channel = require("../models/channels");
// const ChannelMessage = require("../models/channel_messages");
const { ensureAuthenticated } = require("../config/auth");

/********** CHANNELS ***********/

router.get("/", ensureAuthenticated, (req, res) => {
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

router.get("/:id", ensureAuthenticated, (req, res) => {
	let user = req.user._id;
	Channel.findById({
		_id: req.params.id,
	})
    .populate("messages.user")
    .exec((error, channel) => {
		if (error) {
			return handleError(error);
		}
		res.json({channel, user});
	});
});

/********** CHANNEL MESSAGES ***********/

router.put("/message/create", ensureAuthenticated, (req, res) => {
	let new_message = {
		user: req.user._id,
		message: req.body.message,
	};

	Channel.findOneAndUpdate(
		{_id: req.body.channelId},
		{$push: { messages: new_message}},
		{new: true},
		(err, doc) => {
			if (err) {
				return handleError(error);
			}
			let messages = doc.messages;
			let lastMessage = messages[messages.length -1]
			res.send({lastMessage, user: {userName: req.user.name, userId : req.user._id}})
		}
	)
});

router.put("/message/delete", ensureAuthenticated, (req, res) => {
	Channel.updateOne(
		{ '_id': req.body.channelId }, 
		{ $pull: { messages: { _id: req.body.messageId } } },
		{ safe: true },
    	(err, obj) => {
			if (err) {
				return handleError(error);
			}
			console.log(obj)
			res.end()
		}
	)
});

router.put("/message/update", ensureAuthenticated, (req, res) => {
	Channel.updateOne(
		{ '_id': req.body.channelId }, 
		{ 'messages._id': req.body.messageId }, 
		{ $set: { "messages.$.message": req.body.message } },
    	(err, obj) => {
			if (err) {
				return handleError(error);
			}
			console.log(obj)
			res.end()
		}
	)
});

module.exports = router;
