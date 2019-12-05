var models = require('../models');
var express = require('express');
var router = express.Router();

router.get('/userList', (req, res) => {
    models.UserData.findAll({
        include: [models.UserTodo]
    }).then((users) => {
        res.send('User List: ' + JSON.stringify(users))
    })
});

module.exports = router;