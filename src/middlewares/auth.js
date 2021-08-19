const { authSecret } = require("../.env");
const { verify } = require("jsonwebtoken");
const app = require('../config/db')

module.exports = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, authSecret);
    const id =  decoded.id;
    req.user = id;

    const [user] = await app.db('users').select("*").where({id:req.user}).where("deleted_at", null)
    
  
    if(user === undefined){ 
      return res.status(401).json({ error: 'Disable user' });
    }
    next();
  } catch (error) {
  
    return res.status(401).json({ error: "Token invalid" });
  }
};
