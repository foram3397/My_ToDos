var models = require('../models');
var express = require('express');
var router = express.Router();

router.post('/create', function (req, res) {
    models.UserData.create({
        name: req.body.name,
        email: req.body.email,
        phoneNo: req.body.phoneNo
    }).then(function () {
        res.send('user created');
    });
});

router.get('/destroy', function (req, res) {
    models.UserData.destroy({
        where: {
            id: req.body.user_id
        }
    }).then(function () {
        res.send('user destroyed');
    });
});

router.post('/tasks/create', function (req, res) {
    models.UserTodo.create({
        taskName: req.body.taskName,
        taskContent: req.body.taskContent,
        UserDatumId: req.body.user_id
    }).then(function () {
        res.send('task created');
    });
});

router.get('/tasks/destroy', function (req, res) {
    models.UserTodo.destroy({
        where: {
            id: req.body.task_id
        }
    }).then(function () {
        res.send('task destroyed');
    });
});


module.exports = router;