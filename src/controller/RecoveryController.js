const app = require("../config/db");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { addMinutes, isAfter } = require("date-fns");
const Mail = require("../util/SendMail");
const mailConfig = require("../config/mail");

module.exports = {
  async store(req, res) {
    const { email } = req.body;
    const user = await app
      .db("users")
      .select("email")
      .where({ email: email })
      .first();
   
    if (!user) return res.status(401).json({ error: "User do not found" });

    const token = await crypto.randomBytes(8).toString("hex");
    const expToken = addMinutes(new Date(), 10);

    Mail.sendMail({
      from: mailConfig.from,
      to: user.email,
      subject: "Password recovery",
      text: `Password recovery token  ${token}`,
    });

    await app
      .db("users")
      .update({ token, expToken })
      .where({ email: email })
      .then((_) => res.status(201).json({ msg: "Email successfully sent!" }))
      .catch((error) => res.status(400).send(console.log(error)));
  },

  async update(req, res) {
    
    const { token, password } = req.body;
    const hash =  bcrypt.hashSync(password,10);

    const user = await app
      .db("users")
      .select("*")
      .where({ token: token })
      .catch((error) => res.status(500).send(error));

    if (!user) return res.json({ error: "User does not found" });
    
    const [expToken] = user.map((e) => e.expToken);
    const [id] = user.map((e) => e.id);
    
    try {
      if (isAfter(new Date(), new Date(expToken))) {
        await app
          .db("users")
          .update({ token: null, expToken: null })
          .where({ id: id });

        return res.status(401).json({ error: " Token expired..." });
      } 
        await app
          .db("users")
          .update({ password: hash, token: null, expToken: null })
          .where({ id: id });

        return res.status(201).json("Password reset successfully...");
    
    } catch (error) {
      res.status(500).send(error);
    }   
  
  }
};



