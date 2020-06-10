const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  title: {
    type: String,
  },
  // firstParentId: {
  //   type: String,
  // },
  // SecondParentId: {
  //   type: String,
  // },
  isMainCategory: {
    type: Boolean,
    default: false,
  },
  isSecondLevelCategory: {
    type: Boolean,
    default: false,
  },
  isThirdLevelCategory: {
    type: Boolean,
    default: false,
  },
  isSpecial: {
    type: Boolean,
    default: false,
  },
  parentList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  childrenList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});

const Category = mongoose.model("category", CategorySchema);

module.exports = Category;
