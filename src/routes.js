
const routes = require("express").Router();
const UserController = require('./controller/UserController')
const TaskController = require('./controller/TaskController')
const Authenticate = require ('./controller/AuthController')
const RecoveryController = require ('./controller/RecoveryController')
const UserValidation = require('./middlewares/userValidation')
const Auth = require('./middlewares/auth');

 
 routes.post('/signup',UserValidation,UserController.store)
       .post('/signin',Authenticate.AuthController)
       .post('/forgot',RecoveryController.store)
       .put('/reset',RecoveryController.update)
       .put('/active/:id',UserValidation,UserController.active)
       .get('/teste',UserController.indexAll)
      //  .get('/task',TaskController.getTasks)
      //  .post('/task',TaskController.store)
 routes.use(Auth)      
       .get('/users/:id',UserController.index)
       .put('/users/:id',UserController.update)
       .delete('/users/:id',UserController.softDel)
       .delete('/destroy/:id',UserController.destroy);
routes.use(Auth)
       .get('/task',TaskController.getTasks)
       .post('/task',TaskController.store)
routes.use(Auth)              
       .put('/task/:id/toogle',TaskController.toogleTask) 
routes.use(Auth)              
       .delete('/task/:id/',TaskController.remove)       
       
module.exports = routes;

// app.route('/tasks')
// .all(app.config.passport.authenticate())
// .get(app.api.task.getTasks)
// .post(app.api.task.save)

// app.route('/tasks/:id')
// .all(app.config.passport.authenticate())
// .delete(app.api.task.remove)

// app.route('/tasks/:id/toggle')
// .all(app.config.passport.authenticate())
// .put(app.api.task.toggleTask)