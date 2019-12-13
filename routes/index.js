var middleware = require('../middleware');
var authController = require("../controllers/auth.controller");
var mainController = require("../controllers/mainController");

module.exports = (app, passport) => {

    authController.init(app);
    mainController.init(app);
    middleware.init(app);

    /**
     * @api {get} /signup A. Signup -GET
     * @apiName Signup
     * @apiGroup Signup
     * @apiVersion 1.0.0
     * 
     * @apiDescription
     * Renders HTML view of the Sign Up form
     * 
     */

    app.get('/signup', authController.renderIndex);

    /**
     * @api {post} /signUp Register a new user
     * @apiName SignUp
     * @apiGroup SignUp
     * @apiVersion 1.0.0
     * 
     * @apiDescription
     * Create or register a new user
     * 
     * @apiExample Example usage:
     * 
     *  url: /signUp
     *  body: {
     *      "first_name": "abc",
     *      "last_name": "def",
     *      "password": "abc@1234",
     *      "email":"abc@gmail.com",
     *      "phoneNo": "1234567895"
     *  }
     * 
     * @apiParam {String} first_name      first_name.
     * @apiParam {String} last_name       last_name.
     * @apiParam {String} password        password.
     * @apiParam {String} email           email.
     * @apiParam {String} phoneNo         phoneNo.
     * 
     * @apiSuccess {object} payload       Signup user Data.
     * 
     * @apiSuccessExample Success Response
     * {
     *      "id":1,
     *      "email": "abc@gmail.com",
     *      "password": "abc@1234",
     *      "name": "abc def",
     *      "phoneNo": "1234567895",
     *      "updatedAt": "2019-12-13T07:18:14.660Z",
     *      "createdAt": "2019-12-13T07:18:14.660Z"
     * }
     * 
     */

    app.post('/signUp', passport.authenticate('local-signup'), authController.renderSignup);

    /**
     * @api {get} /loginView A. Login -GET
     * @apiName Login View
     * @apiGroup Login View
     * @apiVersion 1.0.0
     * 
     * @apiDescription
     * Renders HTML view of the Login form
     * 
     */

    app.get('/loginView', authController.renderLoginView);

    /**
     * @api {post} /login Login user
     * @apiName Login
     * @apiGroup Login
     * @apiVersion 1.0.0
     * 
     * @apiDescription
     * Login user
     * 
     * @apiExample Example usage:
     * 
     *  url: /login
     *  body: {
     *      "email":"abc@gmail.com",
     *      "password":"abc@1234"
     *  }
     *
     * @apiParam {String} email           email. 
     * @apiParam {String} password        password.
     * 
     * @apiSuccess {object} payload       Login user Data.
     * 
     * @apiSuccessExample Success Response
     * {
     *      "id":1,
     *      "email": "abc@gmail.com",
     *      "password": "abc@1234",
     *      "name": "abc def",
     *      "phoneNo": "1234567895",
     *      "updatedAt": "2019-12-13T07:18:14.660Z",
     *      "createdAt": "2019-12-13T07:18:14.660Z"
     * }
     * 
     */

    app.post('/login', passport.authenticate('local-signin'), authController.renderLogin);

    /**
     * @api {get} /userList List all users
     * @apiName User list
     * @apiGroup User list
     * @apiVersion 1.0.0
     * 
     * @apiDescription
     * List all the users data
     * 
     * @apiSuccess {Object[]} payload     User's list
     * @apiSuccessExample Success Response
     * [
    {
        "id": 1,
        "name": "raj",
        "email": "raj@gmail.com",
        "password": "raj@1234",
        "phoneNo": "123456778",
        "createdAt": "2019-12-05T08:28:18.000Z",
        "updatedAt": "2019-12-05T08:28:18.000Z",
        "UserTodos": []
    },
    {
        "id": 2,
        "name": "johnho",
        "email": "john@gmail.com",
        "password": "john@1234",
        "phoneNo": "123456778",
        "createdAt": "2019-12-05T08:30:01.000Z",
        "updatedAt": "2019-12-05T08:30:01.000Z",
        "UserTodos": [
            {
                "id": 10,
                "taskName": "create  app",
                "taskContent": "react app is very easy to create and it should require login",
                "createdAt": "2019-12-06T08:11:35.000Z",
                "updatedAt": "2019-12-06T08:11:35.000Z",
                "UserDatumId": 2,
                "comments": [
                    {
                        "id": 5,
                        "content": "hello",
                        "commenter_username": "abc",
                        "commenter_email": "abc@gmail.com",
                        "status": "approved",
                        "createdAt": "2019-12-06T08:13:02.000Z",
                        "updatedAt": "2019-12-06T08:13:02.000Z",
                        "UserTodoId": 10
                    }
                ]
            },
            {
                "id": 11,
                "taskName": "create  demo app",
                "taskContent": "react app is very easy to create and it should require login",
                "createdAt": "2019-12-06T08:12:02.000Z",
                "updatedAt": "2019-12-06T08:12:02.000Z",
                "UserDatumId": 2,
                "comments": []
            }
        ]
    },
]
     */

    app.get('/userList', middleware.isLoggedIn, mainController.renderUserList);

    app.get('/getUser', mainController.renderGetUser);

    app.post('/create', middleware.isLoggedIn, mainController.createUser);

    app.delete('/destroy', middleware.isLoggedIn, middleware.isAuthenticatedUser, mainController.destroyUser);

    app.post('/tasks/create', middleware.isLoggedIn, middleware.isAuthenticatedUser, mainController.createTask);

    app.delete('/tasks/destroy', middleware.isLoggedIn, middleware.isAuthenticatedUser, mainController.destroyTask);

    app.post('/tasks/comments', middleware.isLoggedIn, middleware.isAuthenticatedUser, mainController.createComments);

    app.post('/project', mainController.project);

    app.get('/getProject', mainController.getProject);

};