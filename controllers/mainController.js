(function (mainController) {
    var models = require('../models');
    var User = models.UserData;
    var Task = models.UserTodo;
    var Comments = models.comments;
    var Sequelize = require('sequelize')
    const Op = Sequelize.Op;
    var db = require('../models/index');


    checkParams = (req, res) => {
        if (req.query.filter == 1) {
            req.checkQuery({
                startDate: {
                    notEmpty: true,
                    errorMessage: "Start Date is required"
                },
                endDate: {
                    notEmpty: true,
                    errorMessage: "End Date is required"
                }
            });

            var errors = req.validationErrors();

            if (errors) {
                res.status(400).json(errors);

            }
        }
    }

    getWhereCondition = (req, res) => {
        var query = req.query;
        checkParams(req, res);

        let currentMonth = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);

        let whereStatement = Sequelize.and(
            query.search ? {
                [Op.or]: [
                    {
                        '$UserData.name$': { [Op.like]: '%' + query.search + '%' }
                    }, {
                        '$UserTodos.taskName$': { [Op.like]: '%' + query.search + '%' }
                    }
                ]
            } : null,
            query.filter ?
                (query.filter == 0) ?
                    [{}, db.sequelize.where(db.sequelize.fn("month", db.sequelize.col("UserData.createdAt")), currentMonth)]
                    : (query.filter == 1) ?
                        { createdAt: { [Op.between]: [query.startDate, query.endDate] } }
                        : null
                : null
        );

        return whereStatement;
    }

    mainController.init = function (app) {

        exports.renderUserList = function (req, res) {
            models.UserData.findAll({
                include: [{
                    model: models.UserTodo,
                    include: [{ model: models.comments }]
                }],
                order: [['id', 'ASC']]
            }).then((users) => {
                res.send(JSON.stringify(users));
            })
        };

        exports.renderGetUser = function (req, res) {
            models.UserData.findAll({
                include: [{
                    model: models.UserTodo,
                    include: [{ model: models.comments }],
                }],
                order: [['id', 'ASC']],
                where: getWhereCondition(req, res)
            }).then((users) => {
                res.json(users);
            })
        };

        exports.createUser = function (req, res) {
            models.UserData.findOne({
                where: {
                    email: req.body.email
                }
            }).then((result) => {
                if (result) {
                    res.status(404).json({ message: "Email already taken" });
                } else {
                    var data = {
                        email: req.body.email,
                        password: req.body.password,
                        name: req.body.name,
                        phoneNo: req.body.phoneNo
                    };
                    models.UserData.create(data).then(function () {
                        res.status(200).json({ message: "User created successfully" });
                    });
                }
            })
        };

        exports.destroyUser = function (req, res) {
            models.UserData.destroy({
                where: {
                    id: req.body.user_id
                }
            }).then(function (success) {
                if (success === 1) {
                    res.status(200).json({ message: "Deleted successfully" });
                }
            });
        };

        exports.createTask = function (req, res) {
            models.UserTodo.create({
                taskName: req.body.taskName,
                taskContent: req.body.taskContent,
                UserDatumId: req.body.user_id
            }).then(function (success) {
                if (success === 1) {
                    res.status(200).json({ message: "Task created successfully" });
                }
            }).catch(function (error) {
                res.status(500).json(error);
            });
        };

        exports.destroyTask = function (req, res) {
            models.UserTodo.destroy({
                where: {
                    UserDatumId: req.body.user_id,
                    id: req.body.task_id
                }
            }).then(function (success) {
                if (success === 1) {
                    res.status(200).json({ message: "Deleted successfully" });
                }
                else {
                    res.status(404).json({ message: "Record not found" })
                }
            }).catch(function (error) {
                res.status(500).json(error);
            });
        };

        exports.createComments = function (req, res) {
            models.comments.create({
                content: req.body.content,
                commenter_username: req.body.commenter_username,
                commenter_email: req.body.commenter_email,
                status: req.body.status,
                UserTodoId: req.body.UserTodoId,
            }).then(function (success) {
                if (success) {
                    res.status(200).json({ message: "Comment successfully" });
                }
            }).catch(function (error) {
                res.status(500).json(error);
            });
        };

        exports.project = function (req, res) {
            models.User.create({
                firstname: "Jack",
                lastname: "Davis",
                age: 37
            }).then(jack => {
                let users = [jack];

                return models.User.create({
                    firstname: "Mary",
                    lastname: "Taylor",
                    age: 21
                }).then(mary => {
                    users.push(mary);
                    return users;
                })
            }).then(users => {
                models.Project.create({
                    code: 'P-123',
                    name: 'JSA - Branding Development'
                }).then(p123 => {
                    p123.setWorkers(users);
                })

                models.Project.create({
                    code: 'P-456',
                    name: 'JSA - DataEntry Development'
                }).then(p456 => {
                    p456.setWorkers(users);
                })
            }).then(() => {
                res.send("OK");
            });
        };

        exports.getProject = function (req, res) {
            models.Project.findAll({
                attributes: ['code', 'name'],
                include: [{
                    model: models.User, as: 'Workers',
                    attributes: [['firstname', 'name'], 'age'],
                    through: {
                        attributes: ['projectId', 'userId'],
                    }
                }]
            }).then(projects => {
                res.send(projects);
            });
        }
    }
})(module.exports);