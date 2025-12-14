const db = require("../config/db");

module.exports = {
    getAll: (req, res) => {
        db.all("SELECT * FROM clientes", [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    },

    getById: (req, res) => {
        db.get(
            "SELECT * FROM clientes WHERE id = ?",
            [req.params.id],
            (err, row) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json(row || {});
            }
        );
    },

    create: (req, res) => {
        const { nombre, telefono, direccion } = req.body;

        db.run(
            "INSERT INTO clientes (nombre, telefono, direccion) VALUES (?, ?, ?)",
            [nombre, telefono, direccion],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.json({
                    id: this.lastID,
                    message: "Cliente creado"
                });
            }
        );
    },

    update: (req, res) => {
        const { nombre, telefono, direccion } = req.body;

        db.run(
            "UPDATE clientes SET nombre = ?, telefono = ?, direccion = ? WHERE id = ?",
            [nombre, telefono, direccion, req.params.id],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.json({
                    changes: this.changes,
                    message: "Cliente actualizado"
                });
            }
        );
    },

    remove: (req, res) => {
        db.run(
            "DELETE FROM clientes WHERE id = ?",
            [req.params.id],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.json({
                    changes: this.changes,
                    message: "Cliente eliminado"
                });
            }
        );
    }
};
