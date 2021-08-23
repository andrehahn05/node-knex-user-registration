const app = require("../config/db");
const { endOfDay } = require("date-fns");


const current = new Date();

module.exports = {
  async store(req, res) {
    const task = { ...req.body };
  
    if (!task.desc.trim())
      return res.status(400).json("Description is a required field.");

    task.userId = req.user;
    await app
      .db("tasks")
      .insert(task)
      .then((_) => res.status(201).json(task))
      .catch((error) => res.status(400).json(error));
  },

  async getTasks(req, res) {
    const date = req.query.Date ? req.query.Date : endOfDay(current);

    await app
      .db("tasks")
      .where({ userId: req.user })
      .where("estimate_at", "<=", date)
      .orderBy("estimate_at")
      .then((tasks) => res.status(201).json(tasks))
      .catch((error) => res.status(400).json(error));
  },

  async toogleTask(req, res) {
    await app
      .db("tasks")
      .where({ id: req.params.id, userId: req.user })
      .update({ done_at: new Date() })
      .then((task) => {
        if (!task)
          return res.status(400).json(`Task with id ${req.params.id} not found`);
        else 
          return res.status(201).send();
      })

      .catch((error) => res.status(400).json(error));
  },

  async remove(req, res) {
    await app
      .db("tasks")
      .where({ id: req.params.id, userId: req.user })
      .del()
      .then((rowsDeleted) => {
        if (rowsDeleted > 0) 
          return res.status(201).send();
        else
          return res.status(400).json(`Task with id ${req.params.id} not found`);
      })

      .catch((error) => res.status(400).json(error));
  },
};

