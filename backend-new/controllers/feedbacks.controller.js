const F = require("../models/feedbacks.model.js");

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
    const feedbacks = req.body;
    F.insert(feedbacks, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const feedbacks = req.body;
    const id = req.params.id;
    F.update(feedbacks, id, (result) => {
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
