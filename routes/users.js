const express = require("express");
const router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const passport = require("passport");

/*************** REGISTER ****************/

router.get("/register", (req, res) => {
	res.render("register", { layout: false, title: "Register" });
});

router.post("/register", (req, res, next) => {
	const { name, email, password } = req.body;

	let errors = [];

	// Check for errors in form
	// Else create new user and redirect to Login
	if (!name || !email || !password) {
		errors.push({ msg: "Please fill out all fields!" });
	}
	if (password.length < 8) {
		errors.push({ msg: "Use at least 8 characters for your password!" });
	}
	if (errors.length > 0) {
		res.render("register", {
			errors,
			name,
			email,
			title: "Register",
		});
	} else {
		const newUser = new User({
			name,
			email,
			password,
		});
		bcrypt.hash(password, 10, function (error, hash) {
			if (error) {
				res.end();
				throw error;
			}
			newUser.password = hash;
			newUser.save().then(() => {
				req.flash("success_msg", "You have been registered!");
				res.redirect("/users/login");
			});
		});
	}
});

/************** LOGIN **************/

router.get("/login", (req, res) => {
	res.render("login", { layout: false, title: "Login" });
});

router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/users/login",
		failureFlash: true,
	})(req, res, next);
});

/**************** LOGOUT *****************/

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success_msg", "You have logged out!");
	res.redirect("/users/login");
});

//Export
module.exports = router;
