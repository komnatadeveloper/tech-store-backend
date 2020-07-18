const express = require("express");
const router = express.Router();
// Models
const Picture = require("../../models/Picture");
const Product = require("../../models/Product");
const Category = require("../../models/Category");
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
      console.log('productRouter -> addProduct -> jsonObject ->', jsonObject);
      const {
        brand,
        productNo,
        keyProperties,
        price,
        stockStatus,
        category,
        mainImageIndex,
        specifications
      } = jsonObject;
      // If product will have special category & normal category BOTH
      if (category.length === 2 ) {
        const categoryOrList = category.map(categoryIdItem =>{
          return {
            _id: categoryIdItem
          }
        });
        let categoryDocArray = await Category.find({
          $or: [
            ...categoryOrList,
          ]
        });
        if (categoryDocArray.length !== category.length ) {
          return res.status(400).json({
            errors: [{ msg: "Invalid Category!" }],
          });
        }
        let specialCategoryIndex = categoryDocArray.findIndex(item => item.isSpecial === true);
        // If category.length === 2, one of them should be special category
        if (specialCategoryIndex < 0) {
          return res.status(400).json({
            errors: [{ msg: "Invalid Category!" }],
          });
        }
        if ( specialCategoryIndex >= 0 ) {
          
          const categoryDoc = categoryDocArray[
            specialCategoryIndex === 0 ? 1 : 0
          ];
          if (
            categoryDoc.isSecondLevelCategory
            || categoryDoc.isThirdLevelCategory
          ) {
            product.category = [
              ...category, 
              ...categoryDoc.parentList,
            ];            
          } else {
            product.category = [
              ...category
            ];
          }
        }
      }
      if(category.length === 1) {
        const categoryDoc = await Category.findById( category[0] );
        if( !categoryDoc ) {
          return res.status(400).json({
              errors: [{ msg: "Invalid Category!" }],
            });
        }
        if (
           categoryDoc.isSecondLevelCategory 
          || categoryDoc.isThirdLevelCategory
        ) {
          product.category = [ ...category, ...categoryDoc.parentList ];
        } else {
          product.category = [ ...category ];
        }
      }
      product.brand = brand;
      product.productNo = productNo;
      product.keyProperties = keyProperties;
      product.price = price;
      product.stockStatus = stockStatus;
      console.log('ProductRouter -> addProduct -> specifications -> ',specifications);
      // Check specifications
      if(specifications ) {
        if(specifications.length > 0) {
          let isSpecificationsOk = true;
          specifications.forEach(item => {
            if (!item.key || !item.value ) {
              isSpecificationsOk = false;
            } else if (typeof (item.key) !== 'string' || typeof (item.value) !== 'string' ) {
              isSpecificationsOk = false;
            } else if (item.key.length < 2 || item.value.length < 1) {
              isSpecificationsOk = false;
            }
          })
          if(!isSpecificationsOk) {
            return res
              .status(400)
              .json({
                errors: [{ msg: "Specifications Data has errors!" }],
            });
          }
        }
      } // End of Check specifications
      product.specifications = specifications;
      console.log("mainImageIndex ->", mainImageIndex);
      // Resize, Save to DB, and create List of IMAGES
      const imageList = [];
      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const picture = new Picture();
          picture.image = await resizeFile(req.files[i], 500, 300);
          await picture.save();
          console.log("picture _id ->", picture._id);
          imageList.push({
            imageId: picture._id,
            isMain: mainImageIndex === i ? true : false,
          });
        }
      } else {
        return res
          .status(400)
          .json({
            errors: [{ msg: "No Pictures. Please Add Pictures when Adding a Product!" }],
          });
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


// Delete a Product
router.delete(
  "/product/:productId",
  authAdminMiddleware, 
  async (req, res) => {
    console.log('productRouter -> deleteProduct  FIRED')
    try {
      const productId =   req.params.productId;
      if( !productId ) {
        return res.status(400).json({
          errors: [{ msg: "ID of Product to Delete is not valid!" }],
        });
      }
      if( typeof(productId) !== 'string' || productId === '' ) {
        return res.status(400).json({
          errors: [{ msg: "ID of Product to Delete is not valid!" }],
        });
      }
      const product = await Product.findById(productId);
      for( let i = 0; i < product.imageList.length; i++ ) {
        const picture = await Picture.findById(
          product.imageList[i].imageId
        );
        if( !picture ) {
          // do smt
        } else {
          await picture.remove();
        }
      }
      await product.remove(); 
      res.status(200).json({
        msg: "Product has been deleted successfully",
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
  "/product",
  async (req, res) => {
    console.log(req.query.categoryId)
    console.log('Product Search by Category ID -> Category Id ->', req.query.categoryId)
    try {
      const productList = await Product.find({
        category: req.query.categoryId
      });
      console.log('Product Search by Category ID -> req.query.brandList->', req.query.brandList)
      // İf Admin-Dashboard wants to see brandList to filter
      if (req.query.brandList === '1' && req.query.onlyFilterList === '1' ) {
        console.log('Product Search by Category ID -> request for brandList ->')
        let brandList = [];
        for(let i = 0; i < productList.length; i++) {
          let index = brandList.indexOf(productList[i].brand)
          if(index < 0) {
            brandList.push(productList[i].brand);
          }
        }
        console.log('Product Search by Category ID -> brandList ->', brandList);
        return res.status(200).json({
          brandList
        });
      }
      console.log("Product Search by Category ID -> Product Count ->", productList.length);
      res.status(200).json(
        productList
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);


// Query Products
router.post(
  "/query",
  async (req, res) => {
    const search = req.query.search;
    console.log('productRouter -> Query Products -> query Text ->', search);
    try {
      const categoryList = await Category.find({
        title: {
          $regex: new RegExp(search),
          $options: "i" // case Insensitive
        }
      })
      const categoryOrList = categoryList.map(
        (categoryItem) => {
          return {
          category: categoryItem._id
        }}
      );
      // console.log('categoryOrList ->', categoryOrList)
      // console.log('categoryList ->', categoryList);
      const productList = await Product.find({
        $or: [
          {
            brand: {
              $regex: new RegExp(search),
              $options: "i" // case Insensitive
            }
          },
          {
            productNo: {
              $regex: new RegExp(search),
              $options: "i" // case Insensitive
            }
          },
          // {
          //   category: '5ee2a9d9d8bdcc49c47a8812'
          // }
          ...categoryOrList
        ]
      });
       
      return res.status(200).json({
        productList
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);



// Get Single Image
router.get( 
  '/images/:imageId',
  async (req, res) => {
    try {
      const picture = await Picture.findById(req.params.imageId);
      console.log('ProductRouter -> get Image-> picture.id ->', picture)
      res.set('Content-Type', 'image/jpeg')
      res.send(picture.image)
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
)



module.exports = router;
