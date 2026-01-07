import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export default {
    schema: "./utils/schema.js", // Path to your schema file
    dialect: "mysql", // Specify the database dialect
    driver: "mysql2",
    dbCredentials: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || "3306"),
    },

  };


// export default {
//   schema: "./utils/schema.js", // Path to your schema file
//   dialect: "mysql", // Specify the database dialect
//   driver: "mysql2",
//   dbCredentials: {
//     host: "sql12.freemysqlhosting.net",
//     user: "sql12758314",
//     database: "sql12758314",
//     password:'Hz1iZ9caUJ',
//     port:'3306',
//   },
// };