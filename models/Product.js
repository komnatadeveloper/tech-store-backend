const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  imageList: [
    {
      isMain: {
        type: Boolean,
        default: false
      },
      imageId: {
        type: Schema.Types.ObjectId,
        ref: "Picture"
      },
    },
  ],
  brand: {
    type: String,
  },
  productNo: {
    type: String,
  },
  keyProperties: {
    type: String,
  },
  specifications: [
    {
      key: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  price: {
    type: Number,
  },
  stockStatus: {
    stockQuantity: {
      type: Number,
      default: 0
    },
    isOnOrder: {
      type: Boolean,
    },
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});

const Product = mongoose.model("product", ProductSchema);

module.exports = Product;
