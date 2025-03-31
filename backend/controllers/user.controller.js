const U = require("../models/user.model.js");

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
    const user = req.body;
    U.insert(user, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const user = req.body;
    const id = req.params.id;
    U.update(user, id, (result) => {
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
