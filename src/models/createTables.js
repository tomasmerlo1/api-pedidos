const db = require("../config/db");

const createTables = () => {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS clientes(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                telefono TEXT,
                direccion TEXT
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS productos(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                precio REAL NOT NULL,
                stock INTEGER DEFAULT 0
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS pedidos(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fecha TEXT NOT NULL,
                total REAL NOT NULL,
                id_cliente INTEGER,
                FOREIGN KEY(id_cliente) REFERENCES clientes(id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS detalles(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_pedido INTEGER,
                id_producto INTEGER,
                cantidad INTEGER,
                precio_unitario REAL,
                FOREIGN KEY(id_pedido) REFERENCES pedidos(id),
                FOREIGN KEY(id_producto) REFERENCES productos(id)
            )
        `);

        console.log("Tablas creadas correctamente.");
    });
};

module.exports = createTables;
