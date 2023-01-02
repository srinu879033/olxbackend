const mongoose = require("mongoose");

const productDetails = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, default: "" },
    price: { type: Number, required: [true, "Price of Product is Required"] },
    status: { type: String, default: "unsold" },
    image_urls: { type: Array, default: [] },
    uploadedBy: { type: String, required: [true, "Add the Id of Uploader"] },
    boughtBy: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("productDetails", productDetails);
