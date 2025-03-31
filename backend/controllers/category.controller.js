const C = require("../models/category.model.js");

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
    const category = req.body;
    C.insert(category, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const category = req.body;
    const id = req.params.id;
    C.update(category, id, (result) => {
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
