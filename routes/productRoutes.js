const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticateToken = require("../utils/authenticateToken");

router
  .route("/")
  .get(productController.getAllProducts)
  .post(authenticateToken, productController.addNewProduct);

router
  .route("/getallUnsoldProducts")
  .get(productController.getAllUnsoldProducts);

router
  .route("/getIndividualProducts")
  .get(authenticateToken, productController.getIndividualProducts);

module.exports = router;
