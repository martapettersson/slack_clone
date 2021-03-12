const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/users");

module.exports = function (passport) {
	passport.use(
		new LocalStrategy(
			{
				usernameField: "email",
			},
			function (username, password, done) {
				User.findOne({ email: username }, function (error, user) {
					if (error) {
						return done(error);
					}

					if (!user) {
						return done(null, false, { message: "Incorrect email!" });
					}

					// Compare user password and password input
					bcrypt.compare(password, user.password, (error, isMatch) => {
						if (error) throw error;

						// If passwords match
						if (isMatch) {
							return done(null, user);
						} else {
							return done(null, false, { message: "Incorrect password!" });
						}
					});
				}).catch((error) => console.log(error));
			}
		)
	);

    // To use User Object in Pages later on
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

    passport.deserializeUser((id, done) => {
		User.findById(id, (error, user) => {
            done(error, user)
        })
	});
};