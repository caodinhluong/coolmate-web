const V = require("../models/voucher.model.js");

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
    const voucher = req.body;
    V.insert(voucher, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const voucher = req.body;
    const id = req.params.id;
    V.update(voucher, id, (result) => {
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
