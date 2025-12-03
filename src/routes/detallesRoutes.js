const express = require("express");
const router = express.Router();
const controller = require("../controllers/detallesController");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/pedido/:id_pedido", controller.getByPedido);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
