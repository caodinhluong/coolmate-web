const C = require("../models/cart_details.model.js");

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
    const cart_details = req.body;
    C.insert(cart_details, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const cart_details = req.body;
    const id = req.params.id;
    C.update(cart_details, id, (result) => {
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
