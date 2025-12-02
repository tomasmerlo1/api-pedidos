const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db_name = path.join(__dirname, "../../database.db");

const db = new sqlite3.Database(db_name, (err) => {
    if (err) {
        console.error("Error al conectar con sqlite3:", err.message);
    } else {
        console.log("SQLite conectado:", db_name);
    }
});

module.exports = db;
