const pool = require("../config/config.js");
const { verifyToken } = require("../lib/jwt");

// CEK LOGIN/BELUM
// const authentication = (req, res, next) => {
//   if (req.headers.authorization) {
//     const accessToken = req.headers.authorization.split(" ")[1];
//     if (accessToken) {
//       const decoded = verifyToken(accessToken);

//       const sql = `SELECT * FROM users WHERE id = $1`;

//       pool.query(sql, [decoded.id], (err, result) => {
//         if (err) {
//           console.log(err);
//           res.status(500).json({ message: "Something went wrong" });
//         } else {
//           const foundUser = result.rows[0];
//           if (!foundUser) {
//             res.status(400).json({ message: "User not found" });
//           } else {
//             req.loggedUser = {
//               id: foundUser.id,
//               email: foundUser.email,
//               role: foundUser.role,
//             };
//             next();
//           }
//         }
//       });
//     } else {
//       res.status(400).json({ message: "Unauthorized 1" });
//     }
//   } else {
//     res.status(400).json({ message: "Unauthorized 2" });
//   }
// };

const authentication = (req, res, next) => {
  if (req.headers.authorization) {
    const accessToken = req.headers.authorization.split(" ")[1];
    if (accessToken) {
      try {
        const decoded = verifyToken(accessToken);
        const sql = `SELECT * FROM users WHERE id = $1`;

        pool.query(sql, [decoded.id], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Something went wrong" });
          } else {
            const foundUser = result.rows[0];
            if (!foundUser) {
              return res.status(404).json({ message: "User not found" });
            } else {
              req.loggedUser = {
                id: foundUser.id,
                email: foundUser.email,
                role: foundUser.role,
              };
              next();
            }
          }
        });
      } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid token" });
      }
    } else {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized: No authorization header" });
  }
};

// CEK ROLE USER
// const authorization = (req, res, next) => {
//   const { role } = req.loggedUser;
//   if (role === "admin") {
//     next();
//   } else {
//     res.status(401).json({ message: "Unauthorized 3" });
//   }
// };

const authorization = (req, res, next) => {
  if (req.loggedUser && req.loggedUser.role) {
    const { role } = req.loggedUser;
    if (role === "admin") {
      return next();
    } else {
      return res.status(403).json({ message: "Forbidden: You do not have the required permissions" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized: User not logged in" });
  }
};

module.exports = { authentication, authorization };
