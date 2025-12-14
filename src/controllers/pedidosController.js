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
            res.json(row || {});
        });
    },

    getPedidoCompleto: (req, res) => {
        const id = req.params.id;

        const pedidoQuery = `
            SELECT pedidos.*, clientes.nombre AS cliente_nombre
            FROM pedidos
            LEFT JOIN clientes ON pedidos.id_cliente = clientes.id
            WHERE pedidos.id = ?
        `;

        db.get(pedidoQuery, [id], (err, pedido) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });

            const detallesQuery = `
                SELECT detalles.*, productos.nombre AS producto_nombre
                FROM detalles
                LEFT JOIN productos ON detalles.id_producto = productos.id
                WHERE detalles.id_pedido = ?
            `;

            db.all(detallesQuery, [id], (err, detalles) => {
                if (err) return res.status(500).json({ error: err.message });

                pedido.detalles = detalles;
                res.json(pedido);
            });
        });
    },

    create: (req, res) => {
        const { id_cliente, detalles } = req.body;

        if (!detalles || detalles.length === 0) {
            return res.status(400).json({ error: "Debe enviar detalles del pedido" });
        }

        const ids = detalles.map(d => d.id_producto);
        const placeholders = ids.map(() => "?").join(",");

        db.all(
            `SELECT id, precio FROM productos WHERE id IN (${placeholders})`,
            ids,
            (err, productos) => {
                if (err) return res.status(500).json({ error: err.message });

                if (productos.length !== ids.length) {
                    return res.status(400).json({ error: "Uno o más productos no existen" });
                }

                const precios = {};
                productos.forEach(p => precios[p.id] = p.precio);

                let total = 0;
                detalles.forEach(d => total += precios[d.id_producto] * d.cantidad);

                const fecha = new Date().toISOString().split("T")[0];

                db.run(
                    `INSERT INTO pedidos (fecha, total, id_cliente) VALUES (?, ?, ?)`,
                    [fecha, total, id_cliente],
                    function (err) {
                        if (err) return res.status(500).json({ error: err.message });

                        const id_pedido = this.lastID;

                        const insertDetalle = `
                            INSERT INTO detalles (id_pedido, id_producto, cantidad, precio_unitario)
                            VALUES (?, ?, ?, ?)
                        `;

                        detalles.forEach(d => {
                            db.run(insertDetalle, [
                                id_pedido,
                                d.id_producto,
                                d.cantidad,
                                precios[d.id_producto]
                            ]);
                        });

                        res.json({
                            id_pedido,
                            total,
                            message: "Pedido creado con detalles correctamente"
                        });
                    }
                );
            }
        );
    },

    update: (req, res) => {
        const { fecha, total, id_cliente } = req.body;

        const query = `
            UPDATE pedidos
            SET fecha = ?, total = ?, id_cliente = ?
            WHERE id = ?
        `;

        db.run(
            query,
            [fecha, total, id_cliente, req.params.id],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });

                res.json({
                    changes: this.changes,
                    message: "Pedido actualizado"
                });
            }
        );
    },

    remove: (req, res) => {
        const id = req.params.id;

        db.run(
            "DELETE FROM detalles WHERE id_pedido = ?",
            [id],
            err => {
                if (err) return res.status(500).json({ error: err.message });

                db.run(
                    "DELETE FROM pedidos WHERE id = ?",
                    [id],
                    function (err) {
                        if (err) return res.status(500).json({ error: err.message });

                        res.json({
                            changes: this.changes,
                            message: "Pedido y detalles eliminados correctamente"
                        });
                    }
                );
            }
        );
    },
};
