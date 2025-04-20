const I = require("../models/import_invoices.model.js");

module.exports = {
  getAll: (req, res) => {
    I.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    I.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const import_invoices = req.body;
    I.insert(import_invoices, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const import_invoices = req.body;
    const id = req.params.id;
    I.update(import_invoices, id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    I.delete(id, (result) => {
      res.send(result);
    });
  },
};
