const express = require("express");
const router = express.Router();
const Customer = require("../../models/Customer");
// Middleware
const authAdminMiddleware = require("../../middleware/authAdmin");

// Sign Up
router.post(
  '/signup',  
  async (req, res) => {
    try {
      const { email, password } = req.body;
      // Check if there is an existing customer with the same email
      const doesExist = await Customer.findOne({ email });
      if( doesExist ) {
        return res
          .status(400)
          .json({
            errors: [{ msg: "Someone with this email address already exists!" }],
        });
      }
      const customer = new Customer();
      customer.email = email;
      customer.password = password;

      await customer.save();
      res.status(200).json({
        msg: "Your account is added succesfully",
        category,
      });
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
