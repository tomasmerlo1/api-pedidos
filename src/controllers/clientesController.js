const db = require("../config/db");

module.exports = {
    getAll: (req, res) => {
        try {
            const rows = db.prepare("SELECT * FROM clientes").all();
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getById: (req, res) => {
        try {
            const row = db.prepare("SELECT * FROM clientes WHERE id = ?").get(req.params.id);
            res.json(row || {});
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    create: (req, res) => {
        try {
            const { nombre, telefono, direccion } = req.body;
            const stmt = db.prepare(
                "INSERT INTO clientes (nombre, telefono, direccion) VALUES (?, ?, ?)"
            );
            const result = stmt.run(nombre, telefono, direccion);

            res.json({ id: result.lastInsertRowid, message: "Cliente creado" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    update: (req, res) => {
        try {
            const { nombre, telefono, direccion } = req.body;

            const stmt = db.prepare(
                "UPDATE clientes SET nombre = ?, telefono = ?, direccion = ? WHERE id = ?"
            );
            const result = stmt.run(nombre, telefono, direccion, req.params.id);

            res.json({ changes: result.changes, message: "Cliente actualizado" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    remove: (req, res) => {
        try {
            const stmt = db.prepare("DELETE FROM clientes WHERE id = ?");
            const result = stmt.run(req.params.id);

            res.json({ changes: result.changes, message: "Cliente eliminado" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
