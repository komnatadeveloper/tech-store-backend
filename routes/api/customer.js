const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
// Models
const Customer = require("../../models/Customer");
const Product = require("../../models/Product");
const Category = require("../../models/Category");

// Middleware
const { check, validationResult } = require("express-validator");
// const authAdminMiddleware = require("../../middleware/authAdmin");
const authCustomerMiddleware = require("../../middleware/authCustomer");

// Sign Up
router.post(
  '/auth/signup', 
  [  // Express Validator
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ], // End of Express Validator 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const { email, password } = req.body;
      console.log('customerRouter -> sign up -> email, password', email, password)
      // Check if there is an existing customer with the same email
      const doesExist = await Customer.findOne({ email });
      if( doesExist ) {
        return res
          .status(400)
          .json({
            errors: [{ msg: "Someone with this email address already exists!" }],
        });
      }
      let customer = new Customer({
        email: req.body.email,
        password: req.body.password,
      });
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      customer.password = await bcrypt.hash(req.body.password, salt);
      await customer.save();
      // Return jsonwebtoken
      const payload = {
        user: {
          id: customer._id.toString(),
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
            userId : customer._id 
          });
        }
      );


      // res.status(200).json({
      //   msg: "Your account is added succesfully",
      //   // category,
      // });
        } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);  // End of Sign Up



// Sign in
router.post(
  "/auth/signin", 
  [  // Express Validator
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ], 
  async (req, res) => {
    console.log('customerRouter -> signin -> email, password ->', req.body.email, req.body.password)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    try {
      const { email, password } = req.body;
      // Check if customer exists
      const customer = await Customer.findOne({ email })
      if (!customer) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
      }
      // Confirm password
      const isMatch = await bcrypt.compare(password, customer.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
      }
      // delete password before sending customer info
      customer.password = undefined;
      // Return jsonwebtoken
      const payload = {
        user: {
          id: customer._id.toString(),
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ 
            token,
            customer
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Add Product to favorites
router.post(
  "/product/addToFav/:productId",
  authCustomerMiddleware,
  async (req, res) => {
    console.log('customerRouter -> addToFavorites -> customerId ->', req.customerId);
    try {
      const {productId} = req.params;
      const customer = await Customer.findById(req.customerId);
      if ( !customer ) {
        return res.status(404).json({ msg: 'User does not exist!' });
      }
      const product = await Product.findById(productId);
      if ( !product ) {
        return res.status(404).json({ msg: 'Product does not exist!' });
      }
      if(!customer.favorites) {
        customer.favorites = [];
      }
      // If product is already favorite ? remove : add
      let index = customer.favorites.indexOf(productId);
      if( index >= 0 ) {
        customer.favorites.splice(index, 1);
      } else {
        customer.favorites.push(productId);
      }
      await customer.save();
      return res.status(200).json({
        favorites: customer.favorites
      })
    } catch ( err ) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
); // End of  Add Product to favorites



// Get products by List of IDs
router.post(
  "/product/productList",
  authCustomerMiddleware,
  async (req, res) => {
    console.log('customerRouter -> getProductsById -> customerId ->', req.customerId);
    console.log('customerRouter -> getProductsById -> request.body ->', req.body);
    try {
      const customer = await Customer.findById(req.customerId);
      if (!customer) {
        return res.status(404).json({ msg: 'User does not exist!' });
      }

      const productQuery = req.body.productList.map( productId => (
        { _id: productId }
      ))
      const productListFromDB = await Product.find(
        {
          $or: [ ...productQuery ]
        }
      );
      console.log('customerRouter -> getProductsById -> productListFromDB ->', productListFromDB);
      res.status(200).json(
        productListFromDB,
      );

    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }

  }
);

// Query Products
router.post(
  "/product/query",
  authCustomerMiddleware,
  async (req, res) => {
    const search = req.query.search;
    console.log('customerRouter -> Query Products -> query Text ->', search);
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
          }
        }
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
          ...categoryOrList
        ]
      });

      return res.status(200).json(
        productList
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);








module.exports = router;
