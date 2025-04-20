const P = require("../models/products.model.js");

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
    const products = req.body;
    P.insert(products, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const products = req.body;
    const id = req.params.id;
    P.update(products, id, (result) => {
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
