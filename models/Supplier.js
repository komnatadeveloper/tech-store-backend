const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
  // username: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   trim: true,
  // },
  email: {
    type: String,
    // required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
    // required: true,
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  surName: {
    type: String,
    trim: true,
  },
  tel1: {
    type: String,
    trim: true,
  },
  tel2: {
    type: String,
  },
  address: {
    type: String,
  },
  balance: {
    type: Number, // Minus if user should pay, Plus if user has paid more than necessary
    default: 0.00
  },
  orders: [
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    },
  ],

});

const Supplier = mongoose.model("supplier", SupplierSchema);

module.exports = Supplier;
