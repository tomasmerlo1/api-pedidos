const Database = require("better-sqlite3");
const path = require("path");

const db_path = path.join(__dirname, "../../database.db");

const db = new Database(db_path);

db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        telefono TEXT,
        direccion TEXT
    );

    CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        precio REAL NOT NULL,
        stock INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha TEXT NOT NULL,
        total REAL NOT NULL,
        id_cliente INTEGER,
        FOREIGN KEY (id_cliente) REFERENCES clientes(id)
    );

    CREATE TABLE IF NOT EXISTS detalles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_pedido INTEGER NOT NULL,
        id_producto INTEGER NOT NULL,
        cantidad INTEGER NOT NULL,
        precio_unitario REAL NOT NULL,
        FOREIGN KEY (id_pedido) REFERENCES pedidos(id),
        FOREIGN KEY (id_producto) REFERENCES productos(id)
    );
`);

console.log("Base de datos lista y tablas creadas:", db_path);

module.exports = db;


