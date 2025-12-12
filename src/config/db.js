const Database = require("better-sqlite3");
const path = require("path");

const db_path = path.join(__dirname, "../../database.db");

const db = new Database(db_path, { verbose: console.log });

console.log("SQLite conectado:", db_path);

module.exports = db;

