
const app = require('../config/db');

const userValidation = async (req,res,next) => {

  const user = {...req.body}
  if(req.params.id) user.id = req.params.id;

  if(!user.name) return res.status(400).json({ error: 'Name is required' });
  if(!user.email) return res.status(400).json({ error: 'Email is required' });
  if(!user.password) return res.status(400).json({ error: 'Password not entered' });
  if(user.password !== user.confirmPassword)
     return res.status(400).json({ error: 'Invalid password confirmation' });
  
  if(!user.id){
    const existEmail = await app.db('users').where({email:user.email}).first();
    if(existEmail) return res.status(400).json({ error: 'User already registered' });
  }

  if(user.id){
    const rowsdeleted = app.db('users').where('deleted_at',null).first();
    if(!rowsdeleted)return res.status(400).json({ error: 'User Desible' });
  } 

  next();
};


module.exports = userValidation;