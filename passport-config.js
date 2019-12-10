var Strategy = require('passport-local').Strategy;

module.exports = function (passport, models) {
    var user = models.UserData;

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        user.findByPk(id).then(function (res) {
            if (res) {
                done(null, res.get());
            } else {
                done(res.errors, null);
            }
        });
    });

    passport.use('local-signup', new Strategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {

        user.findOne({
            where: {
                email: email
            }
        }).then((result) => {
            if (result) {
                return done(null, false, {
                    message: 'That email is already taken'
                });
            } else {
                var data = {
                    email: email,
                    password: password,
                    name: req.body.first_name + req.body.last_name,
                    phoneNo: req.body.phoneNo
                };

                user.create(data).then((newUser, created) => {
                    if (!newUser) {
                        return done(null, false);
                    }
                    if (newUser) {
                        return done(null, newUser);
                    }
                })
            }
        })

    }));

    passport.use('local-signin', new Strategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true

    }, (req, email, password, done) => {
        let user = models.UserData;

        user.findOne({
            where: {
                email: email
            }
        }).then((result) => {
            if (!result) {
                return done(null, false, {
                    message: 'Email does not exist'
                });
            }
            if (result.password != password) {

                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }

            var userinfo = result.get();
            return done(null, userinfo);
        }).catch((err) => {
            console.log("Error:", err);

            return done(null, false, {
                message: 'Something went wrong with your Signin'
            });
        })
    }));
}