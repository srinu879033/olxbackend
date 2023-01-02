const { response } = require("express");
const productDetails = require("../models/productDetails");
const userDetails = require("../models/userDetails");
const catchAsync = require("../utils/catchAsync");
const getPayloadFromToken = require("../utils/getPayloadFromToken");
const mongoose = require("mongoose");

const getUserData = async (request, response) => {
  const payload = await getPayloadFromToken(request, response);
  const { mailId } = payload;
  const data = await userDetails.find({ mailId: mailId });
  return data[0];
};

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
    const userData = await getUserData(request, response);
    const result = await productDetails.find({
      uploadedBy: userData._id,
    });
    response.send({ data: result });
  } catch (err) {
    response.send({ msg: err.message });
  }
});

exports.addNewProduct = catchAsync(async (request, response, next) => {
  const { name, price, description = "", image_urls = [] } = request.body;
  try {
    const uploaderData = await getUserData(request, response);
    const result = await productDetails.create({
      _id: mongoose.Types.ObjectId(),
      name,
      price,
      description,
      image_urls,
      uploadedBy: uploaderData._id,
    });
    response.send({ msg: "Product added Successfully" });
  } catch (err) {
    response.send({ msg: err.message });
  }
});

exports.getProductDetails = catchAsync(async (request, response, next) => {
  const { id } = request.params;
  try {
    const result = await productDetails.find({ _id: id });
    const uploaderData = await userDetails.find({
      _id: result[0].uploadedBy,
    });

    response.send({
      productData: result[0],
      sellerData: { name: uploaderData[0].name },
    });
  } catch (err) {
    response.send({ msg: err.message });
  }
});

exports.getIndividualPurchases = catchAsync(async (request, response, next) => {
  try {
    const userData = await getUserData(request, response);
    const result = await productDetails.find({
      boughtBy: userData._id,
    });
    response.send({ data: result });
  } catch (err) {
    response.send({ msg: err.message });
  }
});

exports.buyProduct = catchAsync(async (request, response, next) => {
  try {
    const userData = await getUserData(request, response);
    const { id } = request.body;

    const result = await productDetails.findOneAndUpdate(
      { _id: id, status: "unsold" },
      { boughtBy: userData._id, status: "sold" },
      { new: true }
    );
    if (result) {
      response.send({
        msg: "Product Bought Successfully",
        transactionStatus: true,
      });
    } else {
      response.send({ msg: "Item was sold already", transactionStatus: false });
    }
  } catch (err) {
    response.send({ msg: err.messages, transactionStatus: false });
  }
});
