const S = require("../models/sales_promotions.model.js");

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
    const sales_promotions = req.body;
    S.insert(sales_promotions, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const sales_promotions = req.body;
    const id = req.params.id;
    S.update(sales_promotions, id, (result) => {
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
