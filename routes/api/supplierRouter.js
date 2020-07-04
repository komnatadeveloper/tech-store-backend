const express = require("express");
const router = express.Router();
// Models
const Supplier = require("../../models/Supplier");

// Middleware
const {
  fileCheck,
  resizeFile,
} = require("../../utils/UploadFile");
const { check, validationResult } = require("express-validator");
const authAdminMiddleware = require("../../middleware/authAdmin");



// Add a Supplier
router.post(
  '/supplier/',
  authAdminMiddleware,
  [  // Express Validator
    check("email", "Please include a valid email").isEmail(),
    check(
      "name",
      "Please enter a name"
    ).isLength({ min: 3 }),
    check(
      "address",
      "Please enter an address"
    ).isLength({ min: 3 }),
  ], // End of Express Validator
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      console.log('supplierRouter -> addSupplier -> req.body ->', req.body)
      const {
        email,
        name,
        middleName,
        surName,
        address
      } = req.body;
      const supplier = new Supplier();
      supplier.email = email;
      supplier.name = name;
      supplier.middleName = middleName;
      supplier.surName = surName;
      supplier.address = address;
      supplier.orders = [];
      await supplier.save();
      res.status(200).json({
        msg: "Supplier has been added successfully",
        supplier,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);


// Query Suppliers
router.get(
  "/query",
  authAdminMiddleware,  
  async (req, res) => {
    try {
      const search = req.query.search;
      const supplierList = await Supplier.find({
        $or : [
          {
            name: {
              $regex: new RegExp(search),
              $options: "i" // case Insensitive
            }
          },
          {
            middleName: {
              $regex: new RegExp(search),
              $options: "i" // case Insensitive
            }
          },
          {
            surName: {
              $regex: new RegExp(search),
              $options: "i" // case Insensitive
            }
          },
          {
            address: {
              $regex: new RegExp(search),
              $options: "i" // case Insensitive
            }
          },
        ]
      });

      return res.status(200).json(supplierList);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;