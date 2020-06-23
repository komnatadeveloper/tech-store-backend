const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FeatureSchema = new Schema({
  imageId: {
    type: Schema.Types.ObjectId,
    ref: "Picture"
  },
  featureType: {
    type: String,   // 'category' || 'product'  || 'categoryWithBrand'
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category"
  },
  brand: {
    type: String,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
});

const Feature = mongoose.model("feature", FeatureSchema);

module.exports = Feature;
