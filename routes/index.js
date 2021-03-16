const express = require("express");
const router = express.Router();
const Channel = require("../models/channels");
const ChannelMessage = require("../models/channel_messages");
const { ensureAuthenticated } = require("../config/auth");

/********** WELCOME ***********/

router.get("/", (req, res) => {
	res.render("welcome", { title: "The Slack Clone" });
});

/********** DASHBOARD ***********/
router.get("/dashboard", ensureAuthenticated, (req, res) => {
	const user = req.user;
	const channel = {
		name: "undefined",
	};
	res.render("dashboard", { title: "Dashboard", user, channel });
});

/********** CHANNELS ***********/

router.get("/channels", ensureAuthenticated, (req, res) => {
	Channel.find().exec((error, channels) => {
		if (error) {
			return handleError(error);
		} else {
			res.send(channels);
		}
	});
});

router.post("/new-channels", ensureAuthenticated, (req, res) => {
	let new_channel = new Channel({
		name: req.body.name,
	});
	new_channel.save((err) => {
		if (err) {
			console.log(err);
			res.end();
		} else {
			res.redirect("/dashboard");
		}
	});
});

router.get("/channels/:id", ensureAuthenticated, (req, res) => {
	Channel.findById({
		_id: req.params.id,
	}).exec((error, channel) => {
		if (error) {
			return handleError(error);
		}
		res.send(channel);
	});
});

/********** CHANNEL MESSAGES ***********/

// router.get("/channel/messages", ensureAuthenticated, (req, res) => {
// 	ChannelMessage
//         .find()
//         .populate(["user"])
//         .exec((error, channels) => {
//             if (error) {
//                 return handleError(error)
//             } else {
//                 res.send(channels)
//             }
//         })
// });

// router.post("/channel/new-message", ensureAuthenticated, (req, res) => {
// 	console.log(req.user._id);
// 	console.log(req.body.channel_message);

// 	let new_message = new ChannelMessage({
// 		user: req.user._id,
// 		message: req.body.channel_message,
// 	});
// 	new_message.save((err) => {
// 		if (err) {
// 			console.log(err);
// 			res.end();
// 		} else {
// 			res.redirect("/dashboard");
// 		}
// 	});
// });

//Export
module.exports = router;
