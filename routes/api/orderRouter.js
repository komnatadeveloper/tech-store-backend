const express = require("express");
const router = express.Router();
// Models
const Supplier = require("../../models/Supplier");
const Product = require("../../models/Product");
const Order = require("../../models/Order");
// Middleware
const { check, validationResult } = require("express-validator");
const authAdminMiddleware = require("../../middleware/authAdmin");


// Add an order
router.post(
  '/order/',
  authAdminMiddleware,
  [  // Express Validator
    check("supplierId", "Please include Supplier ID!").isString(),
    check("supplierId", "Please include Supplier ID!").isLength({ min: 1 }),
    check("type", "Please select order Type!").isString(),
    check("address", "Please enter your address").isString(),
    check("address", "Please enter your address").notEmpty(),
    check("orderTotalPrice", "Please give information about Order Total Price!").isNumeric(),
    check("items", "Please include items list").isArray({
      min: 1
    }),
  ], // End of Express Validator 
  async (req, res) => {
    // console.log('orderRouter -> addOrder -> req.body ->', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const {
        supplierId,
        type,
        items,
        orderTotalPrice,
        address
      } = req.body;
      if(
        type !== 'procurement'
        && type !== 'sell'
      ) {
        return res.status(400).json({
          errors: [{ msg: "Invalid Order Type!" }],
        });
      }
      const supplier = await Supplier.findById(supplierId);
      if( !supplier ) {
        return res.status(400).json({
          errors: [{ msg: "Invalid Supplier ID!" }],
        });
      }
      const productOrList = items.map(
        ( item ) => {
          return {
            _id: item.productId
          }
        }
      );
      const productList = await Product.find({
        $or: [
          ...productOrList
        ]
      });
      if( productList.length !== items.length ) {
        return res.status(400).json({
          errors: [{ msg: "Invalid Product ID!" }],
        });
      }
      // Check if is there enough Stock for each item
      let orderSumCheckVariable = 0.00;
      for(let i = 0; i < items.length; i++) {        
        if ( !items[i].quantity ) {
          return res.status(400).json({
            errors: [{ msg: "Invalid Quantity of Item!" }],
          });
        }
        if ( !Number.isInteger(items[i].quantity) ) {
          return res.status(400).json({
            errors: [{ msg: "Invalid Quantity of Item!" }],
          });
        }
        if (items[i].quantity <= 0 ) {
          return res.status(400).json({
            errors: [{ msg: "Invalid Quantity of Item!" }],
          });
        }
        let relatedProduct = productList.find( item => item.id === items[i].productId);     
        if (
          type === 'sell'
          && relatedProduct.stockStatus.stockQuantity < items[i].quantity 
        ) {
          return res.status(400).json({
            errors: [{ msg: `Quantity of Product with ID ${relatedProduct._id} is less than ${items[i].quantity}!` }],
          });
        }
        orderSumCheckVariable += items[i].quantity * parseFloat(items[i].price.toFixed(2));
      }
      if ( orderSumCheckVariable !== orderTotalPrice ) {
        return res.status(400).json({
          errors: [{ msg: "Order Total Price does not match with Order List!" }],
        });
      }
      // Now save Products new quantities
      if (type === 'procurement') {
        const order = new Order();
        order.type = type;
        order.supplierId = supplierId;
        order.items = items;
        order.orderTotalPrice = orderTotalPrice;
        order.address = {
          addressString: supplier.address
        };
        await order.save();
        for (let i = 0; i < items.length; i++) {
          console.log('items ->', items);
          let relatedProduct = productList.find(item => item.id === items[i].productId); 
          console.log('productList ->', productList);
          console.log('relatedProduct ->', relatedProduct);
          let stockStatus = relatedProduct.stockStatus;
          stockStatus = {
            ...stockStatus,
            stockQuantity: stockStatus.stockQuantity + items[i].quantity
          }
          relatedProduct.stockStatus = stockStatus;
          await relatedProduct.save();
        }
        supplier.balance = supplier.balance + orderTotalPrice;
        supplier.orders.push(
          {
            orderId: order._id
          }
        );
        await supplier.save();
        return res.status(200).json({
          msg: "Order has been added successfully",
          order,
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);  // End of Add an order



module.exports = router;