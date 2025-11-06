const S = require("../models/suppliers.model.js");

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
    const suppliers = req.body;
    S.insert(suppliers, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const suppliers = req.body;
    const id = req.params.id;
    S.update(suppliers, id, (result) => {
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
