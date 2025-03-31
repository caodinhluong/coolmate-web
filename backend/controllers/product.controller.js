const P = require("../models/product.model.js");

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
    const product = req.body;
    P.insert(product, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const product = req.body;
    const id = req.params.id;
    P.update(product, id, (result) => {
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
