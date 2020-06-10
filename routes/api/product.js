const express = require("express");
const router = express.Router();
const Picture = require("../../models/Picture");
const Product = require("../../models/Product");
const {
  fileCheck,
  resizeFile,
} = require("../../utils/UploadFile");
// Middleware
const authAdminMiddleware = require("../../middleware/authAdmin");


// Add a Picture
router.post("/add-image/", authAdminMiddleware, fileCheck.single("image"), async (req, res) => {
  try {
    const picture = new Picture();
    picture.image = await resizeFile(req.file, 500, 500);   
    await picture.save();
    res.status(200).json({
      msg: "Image is added successfully",
      _id: picture._id,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add a Product
router.post(
  "/product/",
  authAdminMiddleware, 
  fileCheck.array(
    'images[]', 10
  ),
  async (req, res) => {
    try {
      const product = new Product();
      const jsonObject = JSON.parse(req.body.jsonText);
      const {
        brand,
        productNo,
        keyProperties,
        price,
        stockStatus,
        category,
        mainImageIndex,
      } = jsonObject;
      product.brand = brand;
      product.productNo = productNo;
      product.keyProperties = keyProperties;
      product.price = price;
      product.stockStatus = stockStatus;
      product.category = category;

      console.log("mainImageIndex ->", mainImageIndex);
      // Resize, Save to DB, and create List of IMAGES
      const imageList = [];
      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const picture = new Picture();
          picture.image = await resizeFile(req.files[i], 500, 375);
          await picture.save();
          console.log("picture _id ->", picture._id);
          imageList.push({
            imageId: picture._id,
            isMain: mainImageIndex === i ? true : false,
          });
        }
      }
      console.log("imageList ->", imageList);
      product.imageList = imageList;
      // End of Resize, Save to DB, and create List of IMAGES
      await product.save();
      console.log(req.files.length);
      res.status(200).json({
        msg: "Product has been added successfully",
        product,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
)

// Get Products
router.get(
  "/product/",

  async (req, res) => {
    try {
      const productList = await Product.find({
        category: req.body.categoryId
      });
      console.log("Product Search by Category ID -> Product Count ->", productList.length);
      res.status(200).json({
        msg: "Product endpoint",
        productList,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);



module.exports = router;
