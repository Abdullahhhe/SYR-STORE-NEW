const express = require("express");
const { addToCart, getCart,deleteCart } = require("../controllers/cartCntrollers");
const router = express.Router();

router.post("/", addToCart);
router.get("/", getCart);
router.delete("/", deleteCart);


module.exports = router;
