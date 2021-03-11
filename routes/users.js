const express = require("express");
const router = express.Router();

/********** LOGIN/LOGOUT ***********/

router.get("/login", (req, res) => {
	res.render("login", { title: "Login" });
});

router.post("/login", (req, res, next) => {});

router.get("/logout", (req, res) => {});

/********** REGISTER ***********/

router.get("/register", (req, res) => {
	res.render("register", { title: "Register" });
});

router.post("/register", (req, res, next) => {});

//Export
module.exports = router;
