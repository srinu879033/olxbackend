const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticateToken = require("../utils/authenticateToken");

router
  .route("/")
  .get(authenticateToken, productController.getAllProducts)
  .post(authenticateToken, productController.addNewProduct);

router
  .route("/details/:id")
  .get(authenticateToken, productController.getProductDetails);
router
  .route("/getallUnsoldProducts")
  .get(productController.getAllUnsoldProducts);

router
  .route("/getIndividualProducts")
  .get(authenticateToken, productController.getIndividualProducts);

router
  .route("/getIndividualPurchases")
  .get(authenticateToken, productController.getIndividualPurchases);

router
  .route("/buyProduct")
  .post(authenticateToken, productController.buyProduct);

module.exports = router;
