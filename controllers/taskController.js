const pool = require("../config/config.js");
// MIDLLEWWARE

const DEFAULT_LIMIT = 1;
const DEFAULT_PAGE = 1;

// LIST ALL TASK
const findAll = (req, res, next) => {
  let { page, limit } = req.query;

  // LIMIT & OFFSET

  page = +page || DEFAULT_PAGE;
  limit = +limit || DEFAULT_LIMIT;

  const sql = `SELECT * FROM tasks LIMIT ${limit} OFFSET ${limit * (page - 1)}`;

  pool.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    } else {
      res.status(200).json(result.rows);
    }
  });
};

// DEATIL TASK
const findOne = (req, res, next) => {
  const { id } = req.params;
  const sql = `SELECT * FROM tasks WHERE id = $1`;

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  });
};

// CREATE TASK
const create = (req, res, next) => {
  const { title, description } = req.body;

  const sql = `INSERT INTO tasks(title, description) VALUES ($1, $2) 
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

// UPDATE
// const update = (req, res, next) => {
//   const { title, description } = req.body;
//   const { id } = req.params;

//   const sql = `SELECT * FROM WHERE id = $1
//   `;

//   pool.query(sql, [id], (err, result) => {
//     if (err) {
//       console.log(err);
//       res.status(500).json({ message: "Something went wrong" });
//     } else {
//       const foundTask = result.rows[0];

//       if (!foundTask) {
//         res.status(404).json({ message: "Task not found" });
//       } else {
//         // UPDATE
//         const updateSql = `UPDATE tasks SET title = $1,
//         description = $2
//         WHERE id = $3
//         `;

//         pool.query(updateSql, [title, description, id], (err, result) => {
//           if (err) {
//             console.log(err);
//             res.status(500).json({ message: "Something went wrong" });
//           } else {
//             res.status(200).json(result.rows({ message: "Task updated" }));
//           }
//         });
//       }
//     }
//   });
// };
const update = (req, res, next) => {
  const { title, description } = req.body;
  const { id } = req.params;

  const sql = `SELECT * FROM tasks WHERE id = $1`;

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
        const updateSql = `UPDATE tasks SET title = $1, description = $2 WHERE id = $3`;

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

module.exports = { update };

// DELETE
// const destroy = (req, res, next) => {
//   const { id } = req.params;

//   const sql = `SELECT * FROM tasks WHERE id = $1`;

//   pool.query(sql, [id], (err, result) => {
//     if (err) {
//       console.log(err);
//       res.status(500).json({ message: "Something went wrong" });
//     } else {
//       const foundTask = result.rows[0];
//       if (!foundTask) {
//         res.status(404).json({ message: "Task not found" });
//       } else {
//         const deleteSql = `DELETE FROM tasks WHERE id = $1`;
//         pool.query(deleteSql, [id], (err, result) => {
//           if (err) {
//             console.log(err);
//             res.status(500).json({ message: "Something went wrong" });
//           } else {
//             res.status(200).json({ message: "Task deleted" });
//           }
//         });
//       }
//     }
//   });
// };

const destroy = (req, res, next) => {
  const { id } = req.params;

  const sql = `SELECT * FROM tasks WHERE id = $1`;

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    } else {
      const foundTask = result.rows[0];
      if (!foundTask) {
        return res.status(404).json({ message: "Task not found" });
      } else {
        const deleteSql = `DELETE FROM tasks WHERE id = $1`;
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
