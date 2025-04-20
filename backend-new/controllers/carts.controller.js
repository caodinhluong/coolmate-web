const C = require("../models/carts.model.js");

module.exports = {
  getAll: (req, res) => {
    C.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    C.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const carts = req.body;
    C.insert(carts, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const carts = req.body;
    const id = req.params.id;
    C.update(carts, id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    C.delete(id, (result) => {
      res.send(result);
    });
  },
};
