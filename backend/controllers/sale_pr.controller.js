const S = require("../models/sale_pr.model.js");

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
    const sale_pr = req.body;
    S.insert(sale_pr, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const sale_pr = req.body;
    const id = req.params.id;
    S.update(sale_pr, id, (result) => {
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
