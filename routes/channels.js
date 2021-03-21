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

router.get("/:id", (req, res) => {
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

router.put("/new-message", (req, res) => {
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
			//should return:
			// new log: {
			// 	date: 2021-03-19T16:57:32.941Z,
			// 	_id: 6054d8065ccdc81292704b5a,
			// 	user: 6054a0b4da532f0de041a901,
			// 	message: 'def last'
			//   }
			res.send({lastMessage, user: {userName: req.user.name, userId : req.user._id}})
		}
	)

	// Channel.findByIdAndUpdate(
	// 	req.body.channelId,
	// 	{ $push: { messages: new_message } },
	// 	(error) => {
	// 		if (error) {
	// 			return handleError(error);
	// 		}
	// 		res.send({ message: req.body.message, username: req.user.name });
	// 	}
	// );
});

router.put("/delete-message", (req, res) => {
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

module.exports = router;
