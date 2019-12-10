var models = require('../models');
var middleware = require('../middleware');
var Handlebars = require('handlebars');

getRandomList = () => {
    let list = ["abc", "def", "ghi", "jakj", "ashu"];
    let limit = Math.floor(Math.random() * (list.length - 1 - 0) + 1);

    return list.slice(limit);
}

var context = {
    "name": "Foram"
}

var c = {
    "language": "Handlebars",
    "adjective": "awesome"
}
var countries = {
    "countries": []
}

var data = {
    node: [
        { name: 'express', url: 'http://expressjs.com/' },
        { name: 'hapi', url: 'http://spumko.github.io/' },
        { name: 'compound', url: 'http://compoundjs.com/' },
        { name: 'derby', url: 'http://derbyjs.com/' }
    ]
}

module.exports = (app, passport) => {

    let user = models.UserData;

    middleware.init(app);


    app.get('/', (req, res) => {
        let people = getRandomList();
        console.log(req.body)

        res.render('index', { c: c, context: context, people: people, countries: countries, data: data });
    })

    app.post('/signup', passport.authenticate('local-signup'), (req, res) => {
        res.json(req.user);
    });

    app.post('/login', passport.authenticate('local-signin'), (req, res) => {
        res.send(req.user);
    });

    app.get('/userList', middleware.isLoggedIn, (req, res) => {
        models.UserData.findAll({
            include: [{
                model: models.UserTodo,
                include: [{ model: models.comments }]
            }],
            order: [['id', 'ASC']]
        }).then((users) => {
            res.json(users)
        })
    });

    app.post('/create', middleware.isLoggedIn, function (req, res) {
        user.findOne({
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
                user.create(data).then(function () {
                    res.status(200).json({ message: "User created successfully" });
                });
            }
        })
    })

    app.delete('/destroy', middleware.isLoggedIn, middleware.isAuthenticatedUser, function (req, res) {
        models.UserData.destroy({
            where: {
                id: req.body.user_id
            }
        }).then(function (success) {
            if (success === 1) {
                res.status(200).json({ message: "Deleted successfully" });
            }
        });
    });

    app.post('/tasks/create', middleware.isLoggedIn, middleware.isAuthenticatedUser, function (req, res) {
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
    });

    app.delete('/tasks/destroy', middleware.isLoggedIn, middleware.isAuthenticatedUser, function (req, res) {
        let msg = '';
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
    });

    app.post('/tasks/comments', middleware.isLoggedIn, middleware.isAuthenticatedUser, function (req, res) {
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
    });

    app.post('/project', function (req, res) {
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
    });

    app.get('/getProject', (req, res) => {
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
    })
};