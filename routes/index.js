const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require("../models/users");

/********** WELCOME ***********/

router.get("/", (req, res) => {
	res.render("welcome", { layout: false,  title: "The Slack Clone" });
});

/********** DASHBOARD ***********/

router.get("/dashboard", ensureAuthenticated, (req, res) => {
	User.findOneAndUpdate(
		{ _id: req.user._id },
		{
			$set: {
				online: true
			},
		}
	).exec(function (err) {
		if (err) {
			console.log(err);
			res.status(500)
		} else {
			res.status(200)
		}
	});
	const user = req.user;
	res.render("dashboard", { title: "Dashboard", user });
});

/********** UPLOADS ***********/

router.post("/edit-profile", (req, res) => {
	try {
		if (!req.files) {
			User.findOneAndUpdate(
				{ _id: req.user._id },
				{
					$set: {
						name: req.body.user_name,
						email: req.body.user_email,
					},
				}
			).exec(function (err) {
				if (err) {
					console.log(err);
					res.status(500).redirect("/dashboard");
				} else {
					res.status(200).redirect("/dashboard");
				}
			});
		} else {
			let profile_pic = req.files.profile_pic;
			let file_name = `./uploads/${profile_pic.name}`;
			profile_pic.mv(file_name);

			User.findOneAndUpdate(
				{ _id: req.user._id },
				{
					$set: {
						profilePic: file_name,
						name: req.body.user_name,
						email: req.body.user_email,
					},
				}
			).exec(function (err) {
				if (err) {
					console.log(err);
					res.status(500).redirect("/dashboard");
				} else {
					res.status(200).redirect("/dashboard");
				}
			});
		}
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
