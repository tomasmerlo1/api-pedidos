const db = require("../config/db");

module.exports = {
    getAll: (req, res) => {
        const query = `
            SELECT pedidos.*, clientes.nombre AS cliente_nombre
            FROM pedidos
            LEFT JOIN clientes ON pedidos.id_cliente = clientes.id
        `;

        db.all(query, [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    },

    getById: (req, res) => {
        const query = `
            SELECT pedidos.*, clientes.nombre AS cliente_nombre
            FROM pedidos
            LEFT JOIN clientes ON pedidos.id_cliente = clientes.id
            WHERE pedidos.id = ?
        `;

        db.get(query, [req.params.id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(row);
        });
    },

    create: (req, res) => {
        const { fecha, total, id_cliente } = req.body;

        db.run(
            "INSERT INTO pedidos (fecha, total, id_cliente) VALUES (?, ?, ?)",
            [fecha, total, id_cliente],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });

                res.json({ id: this.lastID, message: "Pedido creado" });
            }
        );
    },

    update: (req, res) => {
        const { fecha, total, id_cliente } = req.body;

        db.run(
            "UPDATE pedidos SET fecha = ?, total = ?, id_cliente = ? WHERE id = ?",
            [fecha, total, id_cliente, req.params.id],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });

                res.json({ changes: this.changes, message: "Pedido actualizado" });
            }
        );
    },

    remove: (req, res) => {
        db.run("DELETE FROM pedidos WHERE id = ?", [req.params.id], function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ changes: this.changes, message: "Pedido eliminado" });
        });
    },
};
