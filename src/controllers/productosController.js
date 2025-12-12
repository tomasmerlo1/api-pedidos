const db = require("../config/db");

module.exports = {
    getAll: (req, res) => {
        try {
            const rows = db.prepare("SELECT * FROM productos").all();
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getById: (req, res) => {
        try {
            const row = db.prepare("SELECT * FROM productos WHERE id = ?").get(req.params.id);
            res.json(row || {});
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    create: (req, res) => {
        try {
            const { nombre, precio, stock } = req.body;
            const stmt = db.prepare(
                "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)"
            );

            const result = stmt.run(nombre, precio, stock);
            res.json({ id: result.lastInsertRowid, message: "Producto creado" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    update: (req, res) => {
        try {
            const { nombre, precio, stock } = req.body;

            const stmt = db.prepare(
                "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?"
            );

            const result = stmt.run(nombre, precio, stock, req.params.id);

            res.json({ changes: result.changes, message: "Producto actualizado" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    remove: (req, res) => {
        try {
            const stmt = db.prepare("DELETE FROM productos WHERE id = ?");
            const result = stmt.run(req.params.id);

            res.json({ changes: result.changes, message: "Producto eliminado" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};
