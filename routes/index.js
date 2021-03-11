const express = require("express");
const router = express.Router();

/********** WELCOME ***********/

router.get("/", (req, res) => {
	res.render("welcome", { title: "The Slack Clone" });
});

//Export
module.exports = router;
