const I = require("../models/import_invoice_details.model.js");

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
    const import_invoice_details = req.body;
    I.insert(import_invoice_details, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const import_invoice_details = req.body;
    const id = req.params.id;
    I.update(import_invoice_details, id, (result) => {
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
