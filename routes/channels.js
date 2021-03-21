const express = require("express");
const router = express.Router();
const Channel = require("../models/channels");
const { ensureAuthenticated } = require("../config/auth");

/********** CHANNELS ***********/

router.get("/", ensureAuthenticated, (req, res) => {
	Channel.find({ private: false }).exec((error, channels) => {
		if (error) {
			return handleError(error);
		} else {
			res.send(channels);
		}
	});
});

router.post("/create", ensureAuthenticated, (req, res) => {
	let channel = new Channel({
		name: req.body.name,
		description: req.body.description,
	});
	try {
		channel.save((err, doc) => {
			if (err) {
				console.log(err);
				res.status(500)
			} else {
				res.status(200).send(doc)
			}
		})
	} catch (error) {
		console.log(error);
	}
});

router.get("/:id", ensureAuthenticated, (req, res) => {
	Channel.findById({
		_id: req.params.id,
	})
    .populate("messages.user")
    .exec((error, channel) => {
		if (error) {
			return handleError(error);
		}
		res.render("room", {channel, user: req.user, title: channel.name})
	});
});

/********** CHANNEL MESSAGES ***********/

// router.put("/message/create", ensureAuthenticated, (req, res) => {
// 	let new_message = {
// 		user: req.user._id,
// 		message: req.body.message,
// 	};

// 	Channel.findOneAndUpdate(
// 		{_id: req.body.channelId},
// 		{$push: { messages: new_message}},
// 		{new: true},
// 		(err, doc) => {
// 			if (err) {
// 				return handleError(error);
// 			}
// 			let messages = doc.messages;
// 			let lastMessage = messages[messages.length -1]
// 			res.send({lastMessage, user: {userName: req.user.name, userId : req.user._id}})
// 		}
// 	)
// });

// router.put("/message/delete", ensureAuthenticated, (req, res) => {
// 	Channel.updateOne(
// 		{ '_id': req.body.channelId }, 
// 		{ $pull: { messages: { _id: req.body.messageId } } },
// 		{ safe: true },
//     	(err, obj) => {
// 			if (err) {
// 				return handleError(error);
// 			}
// 			res.end()
// 		}
// 	)
// });

// router.put("/message/update", ensureAuthenticated, (req, res) => {
// 	Channel.updateOne(
// 		{ '_id': req.body.channelId }, 
// 		{ 'messages._id': req.body.messageId }, 
// 		{ $set: { "messages.$.message": req.body.message } },
//     	(err, obj) => {
// 			if (err) {
// 				return handleError(error);
// 			}
// 			res.end()
// 		}
// 	)
// });

module.exports = router;
