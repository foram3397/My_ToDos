(function (authController) {
    var models = require('../models');
    var User = models.UserData;
    var Sequelize = require('sequelize')
    const Op = Sequelize.Op;
    var db = require('../models/index');

    authController.init = function (app) {
        exports.renderIndex = function (req, res) {
            res.render('index');
        };

        exports.renderSignup = function (req, res) {
            res.json(req.user);
        };

        exports.renderLoginView = function (req, res) {
            res.render('login');
        };

        exports.renderLogin = function (req, res) {
            res.json(req.user);
        };


    }
})(module.exports);