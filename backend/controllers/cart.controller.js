const C = require("../models/cart.model.js");

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
    const cart = req.body;
    C.insert(cart, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const cart = req.body;
    const id = req.params.id;
    C.update(cart, id, (result) => {
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
