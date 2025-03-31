const C = require("../models/customer_order_detail.model.js");

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
};
