const F = require("../models/feedback.model.js");

module.exports = {
  getAll: (req, res) => {
    F.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    F.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const feedback = req.body;
    F.insert(feedback, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const feedback = req.body;
    const id = req.params.id;
    F.update(feedback, id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    F.delete(id, (result) => {
      res.send(result);
    });
  },
};
