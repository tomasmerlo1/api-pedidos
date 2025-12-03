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
    const { id_cliente, detalles } = req.body;

    if (!detalles || detalles.length === 0) {
        return res.status(400).json({ error: "Debe enviar detalles del pedido" });
    }

    const idsProductos = detalles.map(d => d.id_producto);

    const placeholders = idsProductos.map(() => "?").join(",");
    const query = `SELECT id, precio FROM productos WHERE id IN (${placeholders})`;

    db.all(query, idsProductos, (err, productos) => {
        if (err) return res.status(500).json({ error: err.message });

        if (productos.length !== idsProductos.length) {
            return res.status(400).json({ error: "Uno o más productos no existen" });
        }

        let total = 0;
        const preciosMap = {};
        productos.forEach(p => preciosMap[p.id] = p.precio);

        detalles.forEach(det => {
            total += preciosMap[det.id_producto] * det.cantidad;
        });

        const fecha = new Date().toISOString().split("T")[0];

        const insertPedidoQuery = `
            INSERT INTO pedidos (fecha, total, id_cliente)
            VALUES (?, ?, ?)
        `;

        db.run(insertPedidoQuery, [fecha, total, id_cliente], function (err) {
            if (err) return res.status(500).json({ error: err.message });

            const id_pedido = this.lastID;

            const insertDetalle = `
                INSERT INTO detalles (id_pedido, id_producto, cantidad, precio_unitario)
                VALUES (?, ?, ?, ?)
            `;

            detalles.forEach(det => {
                db.run(insertDetalle, [
                    id_pedido,
                    det.id_producto,
                    det.cantidad,
                    preciosMap[det.id_producto]
                ]);
            });

            res.json({
                id_pedido,
                total,
                message: "Pedido creado con detalles correctamente"
            });
        });
    });
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
