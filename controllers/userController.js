// const pool = require("../config/config.js");
// const bcrypt = require("bcrypt");
// const salt = bcrypt.genSaltSync(10);
// // ROUTE HANDLER

// const register = (req, res, next) => {
//   const { email, password, role } = req.body;
//   //  CEK EMAIL TERDAFTAR
//   const sql = `SELECT * FROM users WHERE email = $1
//   `;

//   pool.query(sql, [email], (err, result) => {
//     if (err) {
//       console.log(err);
//       res.status(500).json({ message: "Something went wrong" });
//     } else {
//       const foundUser = result.rows[0];
//       if (!foundUser) {
//         // REGSISTER USER
//         const insertSql = `INSERT INTO users(email, password, role) VALUES ($1, $2, $3)
//         RETURNING *
//         `;

//         pool.query(insertSql, [email, bcrypt.hashSync(password, salt)], (err, result) => {
//           if (err) {
//             res.status(500).json({ message: "Something went wrong" });
//           } else {
//             // SUCCESS
//             res.status(201).json(result.rows[0]);
//           }
//         });
//       } else {
//         // ERROR
//         res.status(400).json({ message: "Email allready exist" });
//       }
//     }
//   });
// };

// const login = (req, res, next) => {
//   // const { email, password } = req.body;
// };

// module.exports = { register, login };

const pool = require("../config/config.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { generateToken, verifyToken } = require("../lib/jwt");

// ROUTE HANDLER
const register = async (req, res, next) => {
  const { email, password, role } = req.body;

  // Validasi input
  if (!email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Cek email terdaftar
    const sql = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(sql, [email]);
    const foundUser = result.rows[0];

    if (foundUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Register user
    const insertSql = `INSERT INTO users(email, password, role) VALUES ($1, $2, $3) RETURNING *`;
    const insertResult = await pool.query(insertSql, [email, hashedPassword, role]);

    // Success
    res.status(201).json(insertResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM users WHERE email = $1`;
  pool.query(sql, [email], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    } else {
      //
      const foundUser = result.rows[0];

      if (!foundUser) {
        res.status(400).json({ message: "Email not found" });
      } else {
        // CEK PW
        if (bcrypt.compareSync(password, foundUser.password)) {
          // BERHASIL LOGIN
          // GENERATE TOKEN
          const accessToken = generateToken({
            id: foundUser.id,
            email: foundUser.email,
            role: foundUser.role,
          });
          res.status(200).json({ message: "Login success", accessToken, role: foundUser.role });
        } else {
          res.status(400).json({ message: "Wrong password" });
        }
      }
    }
  });
};

module.exports = { register, login };
