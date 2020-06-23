const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");
// Middleware
const { check, validationResult } = require("express-validator");
const authAdminMiddleware = require("../../middleware/authAdmin");


// Add a Category
router.post(
  '/',  
  authAdminMiddleware,
  [
    check('title', 'Title Should be Text').isString(),
    check('title', 'Title Text Length should be minimum 2!').isLength({min: 2}),
  ],
  async (req, res) => {
    // Express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // End of Express-validator
    try {
      const {
        title,
        isMainCategory,
        isSecondLevelCategory,
        isThirdLevelCategory,
        isSpecial,
        parentList,
        childrenList,
      } = req.body;
      const category = new Category();
      category.title = title;
      if (!isMainCategory 
        && !isSecondLevelCategory 
        && !isThirdLevelCategory
      ) {
        return res.status(400).json({
          errors: [{ msg: "Please Select Level of Category!" }],
        });
      } else {
        let counter = 0;
        if(isMainCategory) {
          category.isMainCategory = isMainCategory;
          counter++;
        }
        if(isSecondLevelCategory) {
          category.isSecondLevelCategory = isSecondLevelCategory;
          counter++;
        }
        if(isThirdLevelCategory) {
          category.isThirdLevelCategory = isThirdLevelCategory;
          counter++;
        }
        if( counter !== 1 ) {
          return res.status(400).json({
            errors: [{ msg: "Please Select Level of Category!" }],
          });
        }
      }
      if ( isMainCategory ) {
        category.parentList = [];
      }
      if (isSecondLevelCategory) {
        let isMainLevelParentFound = false;
        for (let i = 0; i < parentList.length; i++) {
          let parentItem = await Category.findById(parentList[i])
          if(!parentItem) {
            return res.status(400).json({
              errors: [{ msg: "Invalid parent category ID" }],
            });
          }
          if( parentItem.isMainCategory === true ) {
            isMainLevelParentFound =true;
          }
        }
        if ( !isMainLevelParentFound ) {
          return res.status(400).json({
            errors: [{ msg: "Invalid parent category ID" }],
          });
        }
        category.parentList = parentList;
      }
      if(isThirdLevelCategory) {
        const parentDocumentList = [];
        let isMainLevelParentFound = false;
        let isSecondLevelParentFound = false;
        for(let i = 0; i < parentList.length; i++) {
          const parentItem = await Category.findById(parentList[i]);
          if(!parentItem) {
            return res.status(400).json({
              errors: [{ msg: "Invalid parent category ID" }],
            });
          }
          if(parentItem.isMainCategory === true) {
            isMainLevelParentFound = true;
          }
          if (parentItem.isSecondLevelCategory === true) {
            isSecondLevelParentFound = true;
          }
          parentDocumentList.push(parentItem);          
        }
        if ( !isSecondLevelParentFound && !isMainLevelParentFound ) {
          return res.status(400).json({
            errors: [{ msg: "Invalid parent category ID" }],
          });
        }
        if (isSecondLevelParentFound && !isMainLevelParentFound) {
          let secondLevelParent = parentDocumentList.filter(
            element => element.isSecondLevelCategory === true
          )[0];
          for (let i = 0; i < secondLevelParent.parentList.length; i++) {
            let parentItem = await Category.findById(secondLevelParent.parentList[i]);
            if ( !parentItem ) {
              return res.status(500).send("Server Error");
            }
            if ( parentItem.isMainCategory === true ) {
              isMainLevelParentFound = true;
              category.parentList = [ parentItem._id, ...parentList];
            }
          }
          if ( !isMainLevelParentFound ) {
            return res.status(500).send("Server Error");
          }          
        }
      }      
      category.childrenList = [];
      await category.save();
      res.status(200).json({
        msg: "Category is added successfully",
        category
      })
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Get Categories
router.get(
  "/", 
  // authAdminMiddleware, 
  async (req, res) => {
    try {
      const categories = await Category.find({});
      res.status(200).json(    
        categories,
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Query Categories
router.get("/query", authAdminMiddleware,  async (req, res) => {
  try {
    const searched = req.query.searched;
    if (!searched) {
      // Do SMT
      return res.status(200).json([]);
    }
    const categoryList = await Category.find({
      title: {
        $regex: new RegExp(searched),
        $options: "i", // case Insensitive
      },
    });
    res.status(200).json(categoryList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


module.exports = router;