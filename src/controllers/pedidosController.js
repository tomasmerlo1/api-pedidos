const db = require("../config/db");

module.exports = {

    getAll: (req, res) => {
        try {
            const query = `
                SELECT pedidos.*, clientes.nombre AS cliente_nombre
                FROM pedidos
                LEFT JOIN clientes ON pedidos.id_cliente = clientes.id
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
                SELECT pedidos.*, clientes.nombre AS cliente_nombre
                FROM pedidos
                LEFT JOIN clientes ON pedidos.id_cliente = clientes.id
                WHERE pedidos.id = ?
            `;

            const row = db.prepare(query).get(req.params.id);
            res.json(row || {});

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getPedidoCompleto: (req, res) => {
        try {
            const id = req.params.id;

            const pedido = db.prepare(`
                SELECT pedidos.*, clientes.nombre AS cliente_nombre
                FROM pedidos
                LEFT JOIN clientes ON pedidos.id_cliente = clientes.id
                WHERE pedidos.id = ?
            `).get(id);

            if (!pedido) {
                return res.status(404).json({ error: "Pedido no encontrado" });
            }

            const detalles = db.prepare(`
                SELECT detalles.*, productos.nombre AS producto_nombre
                FROM detalles
                LEFT JOIN productos ON detalles.id_producto = productos.id
                WHERE detalles.id_pedido = ?
            `).all(id);

            pedido.detalles = detalles;

            res.json(pedido);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    create: (req, res) => {
        try {
            const { id_cliente, detalles } = req.body;

            if (!detalles || detalles.length === 0) {
                return res.status(400).json({ error: "Debe enviar detalles del pedido" });
            }

            const ids = detalles.map(d => d.id_producto);
            const placeholders = ids.map(() => "?").join(",");

            const productos = db
                .prepare(`SELECT id, precio FROM productos WHERE id IN (${placeholders})`)
                .all(...ids);

            if (productos.length !== ids.length) {
                return res.status(400).json({ error: "Uno o más productos no existen" });
            }

            const precios = {};
            productos.forEach(p => precios[p.id] = p.precio);

            let total = 0;
            detalles.forEach(det => total += precios[det.id_producto] * det.cantidad);

            const fecha = new Date().toISOString().split("T")[0];

            const pedidoStmt = db.prepare(`
                INSERT INTO pedidos (fecha, total, id_cliente)
                VALUES (?, ?, ?)
            `);

            const pedidoRes = pedidoStmt.run(fecha, total, id_cliente);
            const id_pedido = pedidoRes.lastInsertRowid;

            const detStmt = db.prepare(`
                INSERT INTO detalles (id_pedido, id_producto, cantidad, precio_unitario)
                VALUES (?, ?, ?, ?)
            `);

            detalles.forEach(det => {
                detStmt.run(id_pedido, det.id_producto, det.cantidad, precios[det.id_producto]);
            });

            res.json({
                id_pedido,
                total,
                message: "Pedido creado con detalles correctamente"
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    update: (req, res) => {
        try {
            const { fecha, total, id_cliente } = req.body;

            const stmt = db.prepare(`
                UPDATE pedidos
                SET fecha = ?, total = ?, id_cliente = ?
                WHERE id = ?
            `);

            const result = stmt.run(fecha, total, id_cliente, req.params.id);

            res.json({ changes: result.changes, message: "Pedido actualizado" });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    remove: (req, res) => {
        try {
            const stmt = db.prepare("DELETE FROM pedidos WHERE id = ?");
            const result = stmt.run(req.params.id);

            res.json({ changes: result.changes, message: "Pedido eliminado" });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};
