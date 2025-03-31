const S = require("../models/supplier.model.js");

module.exports = {
  getAll: (req, res) => {
    S.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    S.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const supplier = req.body;
    S.insert(supplier, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const supplier = req.body;
    const id = req.params.id;
    S.update(supplier, id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    S.delete(id, (result) => {
      res.send(result);
    });
  },
};
