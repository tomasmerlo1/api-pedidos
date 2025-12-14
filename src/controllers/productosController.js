const db = require("../config/db");

module.exports = {

    getAll: (req, res) => {
        db.all("SELECT * FROM productos", [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    },

    getById: (req, res) => {
        db.get(
            "SELECT * FROM productos WHERE id = ?",
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
        const { nombre, precio, stock } = req.body;

        const query = `
            INSERT INTO productos (nombre, precio, stock)
            VALUES (?, ?, ?)
        `;

        db.run(query, [nombre, precio, stock], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                id: this.lastID,
                message: "Producto creado"
            });
        });
    },

    update: (req, res) => {
        const { nombre, precio, stock } = req.body;

        const query = `
            UPDATE productos
            SET nombre = ?, precio = ?, stock = ?
            WHERE id = ?
        `;

        db.run(query, [nombre, precio, stock, req.params.id], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                changes: this.changes,
                message: "Producto actualizado"
            });
        });
    },

    remove: (req, res) => {
        db.run(
            "DELETE FROM productos WHERE id = ?",
            [req.params.id],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.json({
                    changes: this.changes,
                    message: "Producto eliminado"
                });
            }
        );
    },
};
