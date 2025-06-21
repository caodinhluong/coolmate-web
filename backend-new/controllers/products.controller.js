const P = require("../models/products.model.js");

module.exports = {
  getAll: (req, res) => {
    P.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    P.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const products = req.body;
    P.insert(products, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const products = req.body;
    const id = req.params.id;
    P.update(products, id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    P.delete(id, (result) => {
      res.send(result);
    });
  },
  findByTitle: (req, res) => {
  const title = req.query.title;
  if (!title) {
    return res.status(400).send({ message: "Vui lòng cung cấp title để tìm kiếm!" });
  }

  P.findByTitle(title, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Không tìm thấy sản phẩm nào có title là '${title}'.`
        });
      } else {
        res.status(500).send({
          message: "Đã có lỗi xảy ra khi tìm kiếm sản phẩm."
        });
      }
    } else {
      res.status(200).send(data);
    }
  });
  },
  searchByName :(req, res) => {
  // Lấy tên sản phẩm từ query parameter (?name=...)
  const name = req.query.name;

  if (!name) {
    return res.status(400).send({
      message: "Search query 'name' cannot be empty!",
    });
  }

  P.findByName(name, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        // Trả về mảng rỗng nếu không tìm thấy thay vì lỗi 404
        res.send([]);
      } else {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving products.",
        });
      }
    } else {
      res.send(data);
    }
  });
},
getSuggestions:(req, res) => {
  // Lấy query từ `q` (viết tắt của query)
  const query = req.query.q;

  if (!query) {
    // Nếu không có query, trả về mảng rỗng
    return res.send([]);
  }

  P.getSuggestions(query, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Lỗi khi lấy gợi ý tìm kiếm.",
      });
    } else {
      res.send(data);
    }
  });
},
findByCategory : (req, res) => {
  // Lấy category_id từ query parameter, ví dụ: /api/products/category?id=3
  const categoryId = req.query.category_id;

  if (!categoryId) {
    return res.status(400).send({
      message: "Vui lòng cung cấp category ID."
    });
  }

  P.findByCategoryId(categoryId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Đã xảy ra lỗi khi truy vấn sản phẩm theo danh mục."
      });
    } else {
      res.send(data);
    }
  });
},
};
