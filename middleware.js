(function (middleware) {

    middleware.init = function (app) {

        exports.isLoggedIn = function (req, res, next) {
            if (req.isAuthenticated())
                return next();
            else {
                res.status(401).json({ message: "You are not Logged in user" });
            }
        };

        exports.isAuthenticatedUser = function (req, res, next) {
            if (req.user && req.user.id == req.body.user_id)
                return next();
            else {
                res.status(401).json({ message: "You are not authenticated in user" });
            }
        };
    };
})(module.exports);