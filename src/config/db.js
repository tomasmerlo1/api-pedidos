const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db_path = path.join(__dirname, "../../database.db");

const db = new sqlite3.Database(db_path, (err) => {
    if (err) {
        console.error("Error al conectar con SQLite:", err.message);
    } else {
        console.log("SQLite conectado:", db_path);
    }
});

module.exports = db;
