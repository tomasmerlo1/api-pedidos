const express = require("express");
const cors = require("cors");
require("dotenv").config();

const apiKey = require("./middlewares/apiKey");
const createTables = require("./models/createTables");

const productosRoutes = require("./routes/productosRoutes");
const clientesRoutes = require("./routes/clientesRoutes");
const pedidosRoutes = require("./routes/pedidosRoutes");
const detallesRoutes = require("./routes/detallesRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use(apiKey);

app.use("/productos", productosRoutes);
app.use("/clientes", clientesRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/detalles", detallesRoutes);

createTables();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo en puerto", PORT));
