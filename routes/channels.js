const express = require("express");
const router = express.Router();
const Channel = require("../models/channels");
const User = require("../models/users");
const { ensureAuthenticated } = require("../config/auth");

/********** CHANNELS ***********/

router.get("/", ensureAuthenticated, (req, res) => {
	Channel.find().exec((error, rooms) => {
		if (error) {
			return handleError(error);
		} else {
			let userRooms = rooms.filter(
				(room) => room.members.includes(req.user._id) || room.private == false
			);
			res.send(userRooms);
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
				res.status(500);
			} else {
				res.status(200).send(doc);
			}
		});
	} catch (error) {
		console.log(error);
	}
});

router.get("/:id", ensureAuthenticated, (req, res) => {
	User.find().exec((error, users) => {
		if (error) {
			return handleError(error);
		} else {
			Channel.findById({
				_id: req.params.id,
			})
				.populate("messages.user")
				.exec((error, channel) => {
					if (error) {
						return handleError(error);
					} else {
						res.render("room", {
							channel,
							user: req.user,
							users,
							title: channel.name,
						});
					}
				});
		}
	});
});

// /********** PRIVATE CHATS ***********/

router.post("/private/create", ensureAuthenticated, (req, res) => {
	Channel.find({ members: { $all: [req.user._id, req.body.user] } }).exec(
		(error, channel) => {
			if (error) {
				return handleError(error);
			} else {
				if (channel.length !== 0) {
					res.status(500);
					res.redirect("/dashboard");
				} else {
					let chat = new Channel({
						name: `${req.user.name} - ${req.body.userName}`,
						private: true,
						members: [req.user._id, req.body.user],
					});
					try {
						chat.save((err, doc) => {
							if (err) {
								console.log(err);
								res.status(500);
							} else {
								res.status(200).send(doc);
							}
						});
					} catch (error) {
						console.log(error);
					}
				}
			}
		}
	);
});

/********** CHANNEL/PRIVATE MESSAGES ***********/

router.put("/message/create", ensureAuthenticated, (req, res) => {
	let new_message = {
		user: req.user._id,
		message: req.body.msg,
	};

	Channel.findOneAndUpdate(
		{ _id: req.body.roomId },
		{ $push: { messages: new_message } },
		{ new: true },
		(err, doc) => {
			if (err) {
				return handleError(error);
			} else {
				res.send(doc);
			}
		}
	);
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
			res.end()
		}
	)
});

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
