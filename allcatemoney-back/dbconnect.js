require("dotenv").config();
const {Pool} =  require("pg") 

/* console.log("Database Password:", process.env.DB_PASS); // เช็คค่ารหัสผ่าน */

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

  pool.connect((err) => {
    if (err) console.error("❌ Database Connection Error:", err);
    else console.log("✅ Connected to PostgreSQL");
  });