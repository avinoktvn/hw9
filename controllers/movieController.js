const pool = require("../config/config.js");
// MIDLLEWWARE

// const DEFAULT_LIMIT = 1;
// const DEFAULT_PAGE = 10;

// // LIST ALL MOVIE
// const findAll = (req, res, next) => {
//   let { page, limit } = req.query;

//   // LIMIT & OFFSET

//   page = +page || DEFAULT_PAGE;
//   limit = +limit || DEFAULT_LIMIT;

//   const sql = `SELECT * FROM movies LIMIT ${limit} OFFSET ${limit * (page - 5)}`;

//   pool.query(sql, (err, result) => {
//     if (err) {
//       console.log(err);
//       res.status(500).json({ message: "Something went wrong" });
//     } else {
//       res.status(200).json(result.rows);
//     }
//   });
// };

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const findAll = (req, res, next) => {
  let { page, limit } = req.query;

  // Set nilai default jika tidak ada parameter yang diberikan
  page = parseInt(page) || DEFAULT_PAGE;
  limit = parseInt(limit) || DEFAULT_LIMIT;

  // Hitung offset
  const offset = limit * (page - 1);

  // Query untuk mendapatkan data movies dengan limit dan offset
  const sql = `SELECT * FROM movies LIMIT $1 OFFSET $2`;

  // Gunakan parameterized query untuk mencegah SQL Injection
  pool.query(sql, [limit, offset], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    } else {
      res.status(200).json(result.rows);
    }
  });
};

module.exports = { findAll };

// DEATIL MOVIE
const findOne = (req, res, next) => {
  const { id } = req.params;
  const sql = `SELECT * FROM movies WHERE id = $1`;

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  });
};

// CREATE MOVIE
const create = (req, res, next) => {
  const { title, description } = req.body;

  const sql = `INSERT INTO movies(title, genres) VALUES ($1, $2)
  RETURNING *
  `;

  pool.query(sql, [title, description], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    } else {
      res.status(201).json(result.rows[0]);
    }
  });
};

// UPDATE MOVIE
const update = (req, res, next) => {
  const { title, description } = req.body;
  const { id } = req.params;

  const sql = `SELECT * FROM movies WHERE id = $1`;

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong" });
    } else {
      const foundTask = result.rows[0];

      if (!foundTask) {
        res.status(404).json({ message: "Task not found" });
      } else {
        // UPDATE
        const updateSql = `UPDATE movies SET title = $1, description = $2 WHERE id = $3`;

        pool.query(updateSql, [title, description, id], (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Something went wrong" });
          } else {
            res.status(200).json({ message: "Task updated" });
          }
        });
      }
    }
  });
};

// DELETE MOVIE
const destroy = (req, res, next) => {
  const { id } = req.params;

  const sql = `SELECT * FROM movies WHERE id = $1`;

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    } else {
      const foundTask = result.rows[0];
      if (!foundTask) {
        return res.status(404).json({ message: "Task not found" });
      } else {
        const deleteSql = `DELETE FROM movies WHERE id = $1`;
        pool.query(deleteSql, [id], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Something went wrong" });
          } else {
            return res.status(200).json({ message: "Task deleted" });
          }
        });
      }
    }
  });
};

module.exports = { findAll, findOne, create, update, destroy };
