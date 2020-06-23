const express = require("express");
const router = express.Router();
const Picture = require("../../models/Picture");
const Feature = require("../../models/Feature");
const Category = require("../../models/Category");
const Product = require("../../models/Product");
const {
  fileCheck,
  resizeFile,
} = require("../../utils/UploadFile");
// Middleware
const authAdminMiddleware = require("../../middleware/authAdmin");



// Add a Feature
router.post(
  "/feature/",
  // authAdminMiddleware,
  fileCheck.single(
    'image'
  ),
  async (req, res) => {
    try {
      const feature = new Feature();
      const jsonObject = JSON.parse(req.body.jsonText);
      const {
        featureType,
        categoryId,
        brand,
        productId,
      } = jsonObject;
      // product.brand = brand;
      // product.productNo = productNo;
      // product.keyProperties = keyProperties;
      // product.price = price;
      // product.stockStatus = stockStatus;
      // product.category = category;
      if( !featureType ) {
        return res.status(400).json({
          errors: [{ msg: "Feature Type is not valid!" }],
        });
      }
      if( 
        typeof(featureType) !== 'string' || !(
          featureType === 'category'
          || featureType === 'product'
          || featureType === 'categoryWithBrand'
        )
      ) {
        return res.status(400).json({
          errors: [{ msg: "Feature Type is not valid!" }],
        });
      }
      feature.featureType = featureType;
      let picture;
      if (req.file) {
        picture = new Picture();
        picture.image = await resizeFile(req.file, 600, 360);
      } else {
        return res.status(400).json({
          errors: [{ msg: "Image doesn't exist!" }],
        });
      }
      if(
        featureType === 'category'
        || featureType === 'categoryWithBrand'
      ) {
        if( !categoryId ) {
          return res.status(400).json({
            errors: [{ msg: "Category Id is not valid!" }],
          });
        }
        if( typeof(categoryId) !== 'string' ) {
          return res.status(400).json({
            errors: [{ msg: "Category Id is not valid!" }],
          });
        }
        const category = Category.findById(categoryId);
        if( !category ) {
          return res.status(400).json({
            errors: [{ msg: "Category Id is not valid!" }],
          });
        } else {
          feature.categoryId = categoryId;
        }
      }
      switch (featureType) {
        case 'categoryWithBrand':
          if( !brand ) {
            return res.status(400).json({
              errors: [{ msg: "Brand is not valid!" }],
            });
          }
          if( typeof(brand) !== 'string' ) {
            return res.status(400).json({
              errors: [{ msg: "Brand is not valid!" }],
            });
          }
          feature.brand = brand;
          break;
        case 'product':
          const product = await  Product.findById(productId);
          if( !product ) {
            return res.status(400).json({
              errors: [{ msg: "Product is not valid!" }],
            });
          }
          feature.productId = productId;
          break;
      }
      await picture.save();
      console.log("picture _id ->", picture._id);
      feature.imageId = picture._id;
      await feature.save();
      // Populate feature before sending it back as response ->
      await feature.populate(
        'categoryId', 'title'
      ).populate(
        'productId'
      ).execPopulate();
      res.status(200).json({
        msg: "Feature has been added successfully",
        feature,
      });      
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
)

// Get Features
router.get(
  "/feature/",
  async (req, res) => {
    // console.log(req.query.categoryId)
    console.log('featureRouter -> fetchFeatures FIRED ->')
    try {
      const featuresList = await Feature.find({      }).populate(
        'categoryId', 'title'
      ).populate(
        'productId'
      );
      console.log('featureRouter -> fetchFeatures  -> featuresList ->', featuresList)
      
      // console.log("Product Search by Category ID -> Product Count ->", productList.length);
      res.status(200).json({
        featuresList
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);


// Delete Feature
router.delete(
  "/feature/:featureId",
  async (req, res) => {
    // console.log(req.query.categoryId)
    console.log('featureRouter -> delete Feature FIRED ->')
    try {
      if ( !req.params.featureId  ) {
        return res.status(400).json({
          errors: [{ msg: "Feature ID should be selected!" }],
        });
      }
      if ( typeof(req.params.featureId) !== 'string'  ) {
        return res.status(400).json({
          errors: [{ msg: "Feature ID is not valid!" }],
        });
      }
      const feature = await Feature.findById(req.params.featureId)
      if( !feature ) {
        return res.status(400).json({
          errors: [{ msg: "Feature not found!" }],
        });
      }
      const picture = await Picture.findById(feature.imageId);
      await picture.remove();
      await feature.remove();
      
      // console.log("Product Search by Category ID -> Product Count ->", productList.length);
      res.status(200).json({
        msg: "Feature is deleted successfully",
        feature
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);







module.exports = router;
