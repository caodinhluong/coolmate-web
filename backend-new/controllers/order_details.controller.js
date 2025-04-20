const O = require("../models/order_details.model.js");

module.exports = {
  getAll: (req, res) => {
    O.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    O.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const order_details = req.body;
    O.insert(order_details, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const order_details = req.body;
    const id = req.params.id;
    O.update(order_details, id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    O.delete(id, (result) => {
      res.send(result);
    });
  },
};
