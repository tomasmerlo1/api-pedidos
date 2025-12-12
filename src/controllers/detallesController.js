const db = require("../config/db");

module.exports = {

    getAll: (req, res) => {
        try {
            const query = `
                SELECT detalles.*, productos.nombre AS producto_nombre
                FROM detalles
                LEFT JOIN productos ON detalles.id_producto = productos.id
            `;

            const rows = db.prepare(query).all();
            res.json(rows);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getById: (req, res) => {
        try {
            const query = `
                SELECT detalles.*, productos.nombre AS producto_nombre
                FROM detalles
                LEFT JOIN productos ON detalles.id_producto = productos.id
                WHERE detalles.id = ?
            `;

            const row = db.prepare(query).get(req.params.id);
            res.json(row || {});

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getByPedido: (req, res) => {
        try {
            const query = `
                SELECT detalles.*, productos.nombre AS producto_nombre
                FROM detalles
                LEFT JOIN productos ON detalles.id_producto = productos.id
                WHERE id_pedido = ?
            `;

            const rows = db.prepare(query).all(req.params.id_pedido);
            res.json(rows);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    create: (req, res) => {
        try {
            const { id_pedido, id_producto, cantidad, precio_unitario } = req.body;

            const stmt = db.prepare(`
                INSERT INTO detalles (id_pedido, id_producto, cantidad, precio_unitario)
                VALUES (?, ?, ?, ?)
            `);

            const result = stmt.run(id_pedido, id_producto, cantidad, precio_unitario);

            res.json({ id: result.lastInsertRowid, message: "Detalle agregado" });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    update: (req, res) => {
        try {
            const { id_pedido, id_producto, cantidad, precio_unitario } = req.body;

            const stmt = db.prepare(`
                UPDATE detalles
                SET id_pedido = ?, id_producto = ?, cantidad = ?, precio_unitario = ?
                WHERE id = ?
            `);

            const result = stmt.run(
                id_pedido,
                id_producto,
                cantidad,
                precio_unitario,
                req.params.id
            );

            res.json({ changes: result.changes, message: "Detalle actualizado" });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    remove: (req, res) => {
        try {
            const stmt = db.prepare("DELETE FROM detalles WHERE id = ?");
            const result = stmt.run(req.params.id);

            res.json({ changes: result.changes, message: "Detalle eliminado" });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};
