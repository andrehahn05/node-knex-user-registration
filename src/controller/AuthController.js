const app = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { authSecret } = require('../.env')

module.exports = {
  
  async AuthController(req, res) {
    const { email, password } = { ...req.body };

    if (!email || !password)
      return res.status(400).json({ error: " Credencias do not match!" });

    const user = await app.db("users").where({ email: email }).first();

    if (!user) return res.status(400).json({ error: "User not found " });

    if(user.deleted_at !== null)
      return res.status(401).json({ error: 'Disable user' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ error: "Credencias do not match" });

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  
    const token = jwt.sign(payload, authSecret, {
      expiresIn:3000
      
    });
    
    return res.json({payload,token});
  },
};
