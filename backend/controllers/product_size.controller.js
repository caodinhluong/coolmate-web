const P = require("../models/product_size.model.js");

module.exports = {
  getAll: (req, res) => {
    P.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    P.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const product_size = req.body;
    P.insert(product_size, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const product_size = req.body;
    const id = req.params.id;
    P.update(product_size, id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    P.delete(id, (result) => {
      res.send(result);
    });
  },
};
