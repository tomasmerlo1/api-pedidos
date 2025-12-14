require("dotenv").config();
const express = require("express");
const cors = require("cors");

const createTables = require("./models/createTables");

const clientesRoutes = require("./routes/clientesRoutes");
const productosRoutes = require("./routes/productosRoutes");
const pedidosRoutes = require("./routes/pedidosRoutes");
const detallesRoutes = require("./routes/detallesRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: "API KEY inválida o faltante" });
    }

    next();
});

createTables();

app.use("/clientes", clientesRoutes);
app.use("/productos", productosRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/detalles", detallesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
