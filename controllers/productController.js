const productDetails = require("../models/productDetails");
const catchAsync = require("../utils/catchAsync");
const getPayloadFromToken = require("../utils/getPayloadFromToken");
const mongoose = require("mongoose");

exports.getAllProducts = catchAsync(async (request, response, next) => {
  try {
    const result = await productDetails.find();
    response.send({ data: result });
  } catch (err) {
    response.send({ msg: err.message });
  }
});

exports.getAllUnsoldProducts = catchAsync(async (request, response, next) => {
  try {
    const result = await productDetails.find({ status: "unsold" });
    response.send({ data: result });
  } catch (err) {
    response.send({ msg: err.message });
  }
});

exports.getIndividualProducts = catchAsync(async (request, response, next) => {
  try {
    const payload = await getPayloadFromToken(request, response);
    const mailId = { payload };
    const result = await productDetails.find({ uploadedBy: mailId });
    response.send({ data: result });
  } catch (err) {
    response.send({ msg: err.message });
  }
});

exports.addNewProduct = catchAsync(async (request, response, next) => {
  const { name, price, description = "", image_urls = [] } = request.body;
  const payload = await getPayloadFromToken(request, response);
  const uploadedBy = payload.mailId;
  try {
    const result = await productDetails.create({
      _id: mongoose.Types.ObjectId(),
      name,
      price,
      description,
      image_urls,
      uploadedBy,
    });
    response.send({ msg: "Product added Successfully" });
  } catch (err) {
    response.send({ msg: err.message });
  }
});
