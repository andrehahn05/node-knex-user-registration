const app = require("../config/db");
const bcrypt = require("bcryptjs");

module.exports = {
  async store(req, res) {
    const user = { ...req.body };

    if (user.confirmPassword) delete user.confirmPassword;
    user.password = bcrypt.hashSync(user.password, 10);

    await app
      .db("users")
      .insert(user)
      .then((_) => res.status(201).json(user))
      .catch((error) => res.status(500).json(error));
  },

  async update(req, res) {
    const user = { ...req.body };
    const { id } = req.params;
  
    if (req.user !== +id) return res.status(400).json({ msg: "User not found" });
    if (Object.values(user).length === 0)
       return res.status(400).json({ msg: "requires at least one field filled in" });

    if (user.password) user.password = bcrypt.hashSync(user.password, 10);

    await app
      .db("users")
      .update(user)
      .where("deleted_at", null)
      .where({ id })
      .then((_) => res.status(201).json(user))
      .catch((error) => res.status(500).json(error));
  },

  async index(req, res) {
    const { id } = req.params;
 
    if (req.user !== +id) return res.status(400).json({ msg: "User not found" });

    await app
      .db("users")
      .select("id", "name", "email", "password", "deleted_at")
      .where({ id })
      .where("deleted_at", null)
      .orderBy("id", "asc")
      .first()
      .then((user) => res.status(200).json(user))
      .catch((error) => res.status(500).json(error));
  },

  async destroy(req, res) {
    const { id } = req.params;
   
    if (req.user !== +id) return res.status(400).json({ msg: "User not found" });

    await app
      .db("users")
      .where({ id })
      .del()
      .then((_) => res.status(201).json({ msg: "User deleted successfully" }))
      .catch((error) => res.status(500).json(error));
  },

  async softDel(req, res, next) {
    try {
      const { id } = req.params;

      if (req.user !== +id) return res.status(400).json({ msg: "User not found" });

      const rowsUpdated = await app
        .db("users")
        .update({ deleted_at: new Date() })
        .where({ id: id, id: req.user });

      if (!rowsUpdated) res.status(400).json({ msg: "User not found" });

      return res.status(201).json({ msg: "user disabled successfully" });

    } catch (error) {
      next(error);
    }
  },

  async active(req, res) {
    const user = { ...req.body };
    const { id } = req.params;

    if (user.confirmPassword) delete user.confirmPassword;
    user.password = bcrypt.hashSync(user.password, 10);

    await app
      .db("users")
      .update({ deleted_at: null })
      .where({ id })
      .then((_) => res.status(201).send())
      .catch((error) => res.status(500).send(error));
  },

  async indexAll(req, res) {
    await app
      .db("users")
      .select("*")
      .orderBy("id", "asc")
      .then((users) => res.status(201).json(users))
      .catch((error) => res.status(500).json(error));
  },
};
