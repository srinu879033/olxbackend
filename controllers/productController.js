const productDetails = require("../models/productDetails");

exports.getAllProducts = async (request, response, next) => {
  const result = await productDetails.find();
  response.send(result);
};
