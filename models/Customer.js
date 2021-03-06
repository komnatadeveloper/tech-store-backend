const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  // username: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   trim: true,
  // },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
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
  },
  tel1: {
    type: String,
    trim: true,
  },
  tel2: {
    type: String,
  },
  addressList: [
    {
      definition: {
        type: String,
      },
      receiver: {
        type: String,
      },
      addressString: {
        type: String,
      },
      city: {
        type: String,
      },
      isMain: {
        type: Boolean
      }
    }
  ], 
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
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  specialPriceItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      price: Number
    }
  ]
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
