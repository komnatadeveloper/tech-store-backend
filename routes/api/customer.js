const express = require("express");
const router = express.Router();
const Customer = require("../../models/Customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
// Middleware
const { check, validationResult } = require("express-validator");
const authAdminMiddleware = require("../../middleware/authAdmin");

// Sign Up
router.post(
  '/signup', 
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
          res.status(200).json({ token });
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
);

// Get Categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(    
      categories,
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


module.exports = router;
