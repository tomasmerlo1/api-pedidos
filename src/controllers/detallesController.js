const db = require("../config/db");

module.exports = {
    getAll: (req, res) => {
        const query = `
            SELECT detalles.*, productos.nombre AS producto_nombre
            FROM detalles
            LEFT JOIN productos ON detalles.id_producto = productos.id
        `;

        db.all(query, [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    },

    getById: (req, res) => {
        const query = `
            SELECT detalles.*, productos.nombre AS producto_nombre
            FROM detalles
            LEFT JOIN productos ON detalles.id_producto = productos.id
            WHERE detalles.id = ?
        `;

        db.get(query, [req.params.id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(row);
        });
    },

    // obtener todos los detalles de un pedido
    getByPedido: (req, res) => {
        const query = `
            SELECT detalles.*, productos.nombre AS producto_nombre
            FROM detalles
            LEFT JOIN productos ON detalles.id_producto = productos.id
            WHERE id_pedido = ?
        `;

        db.all(query, [req.params.id_pedido], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    },

    create: (req, res) => {
        const { id_pedido, id_producto, cantidad, precio_unitario } = req.body;

        db.run(
            "INSERT INTO detalles (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
            [id_pedido, id_producto, cantidad, precio_unitario],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ id: this.lastID, message: "Detalle agregado" });
            }
        );
    },

    update: (req, res) => {
        const { id_pedido, id_producto, cantidad, precio_unitario } = req.body;

        db.run(
            "UPDATE detalles SET id_pedido = ?, id_producto = ?, cantidad = ?, precio_unitario = ? WHERE id = ?",
            [id_pedido, id_producto, cantidad, precio_unitario, req.params.id],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ changes: this.changes, message: "Detalle actualizado" });
            }
        );
    },

    remove: (req, res) => {
        db.run("DELETE FROM detalles WHERE id = ?", [req.params.id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ changes: this.changes, message: "Detalle eliminado" });
        });
    },
};
