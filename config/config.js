const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "hw9-mentoring",
  password: "kiroro123",
  port: 5432,
});

module.exports = pool;
