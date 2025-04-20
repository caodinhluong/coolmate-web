const U = require("../models/users.model.js");

module.exports = {
  getAll: (req, res) => {
    U.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    U.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const users = req.body;
    U.insert(users, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const users = req.body;
    const id = req.params.id;
    U.update(users, id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    U.delete(id, (result) => {
      res.send(result);
    });
  },
};
