const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PictureSchema = new Schema({
  image:  {
    type: Buffer
  }  
});

const Picture = mongoose.model("picture", PictureSchema);

module.exports = Picture;
