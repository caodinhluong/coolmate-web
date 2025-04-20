const C = require("../models/categories.model.js");

module.exports = {
  getAll: (req, res) => {
    C.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    C.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const categories = req.body;
    C.insert(categories, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const categories = req.body;
    const id = req.params.id;
    C.update(categories, id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    C.delete(id, (result) => {
      res.send(result);
    });
  },
};
