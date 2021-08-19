
const routes = require("express").Router();
const UserController = require('./controller/UserController');
const Authenticate = require ('./controller/AuthController')
const RecoveryController = require ('./controller/RecoveryController')
const UserValidation = require('./middlewares/userValidation')
const Auth = require('./middlewares/auth');

 
 routes.post('/signup',UserValidation,UserController.store)
       .post('/signin',Authenticate.AuthController)
       .post('/forgot',RecoveryController.store)
       .put('/reset',RecoveryController.update)
       .put('/active/:id',UserValidation,UserController.active)
       .get('/teste',UserController.indexAll);
 routes.use(Auth)      
       .get('/users/:id',UserController.index)
       .put('/users/:id',UserController.update)
       .delete('/users/:id',UserController.softDel)
       .delete('/destroy/:id',UserController.destroy);
       
module.exports = routes;