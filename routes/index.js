const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

/********** WELCOME ***********/

router.get("/", (req, res) => {
	res.render("welcome", { title: "The Slack Clone" });
});

/********** DASHBOARD ***********/

router.get("/dashboard", ensureAuthenticated, (req, res) => {
	const user = req.user;
	res.render("dashboard", { title: "Dashboard", user });
});

router.get("/online", ensureAuthenticated, (req, res) => {
	const userName = req.user.name;
	res.json(userName);
});

module.exports = router;
