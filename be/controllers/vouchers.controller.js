const V = require("../models/vouchers.model.js");

module.exports = {
  getAll: (req, res) => {
    V.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    V.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const vouchers = req.body;
    V.insert(vouchers, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const vouchers = req.body;
    const id = req.params.id;
    V.update(vouchers, id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    V.delete(id, (result) => {
      res.send(result);
    });
  },
};
