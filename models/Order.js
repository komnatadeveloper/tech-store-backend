const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
  },
  type: {
    type: String, // 'procurement' || 'sell'
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      brand: {
        type: String,
      },
      productNo: {
        type: String,
      },
      keyProperties: {
        type: String,
      },
      mainImageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Picture",
      },
      price: {
        type: Number,
      },
      quantity: {
        type: Number,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: String
  },
  orderTotalPrice: {
    type: Number,
  },
});

const Order = mongoose.model("order", OrderSchema);

module.exports = Order;
