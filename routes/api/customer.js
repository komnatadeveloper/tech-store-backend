const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
// Models
const Customer = require("../../models/Customer");
const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Order = require("../../models/Order");
const Feature = require("../../models/Feature");

// Middleware
const { check, validationResult } = require("express-validator");
// const authAdminMiddleware = require("../../middleware/authAdmin");
const authCustomerMiddleware = require("../../middleware/authCustomer");
// Credit Card Payment
const { getPayment } = require("../../utils/CreditCardPayment");


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
      // delete password before sending customer info
      customer.password = undefined;
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
      if ( 
        !customer.specialPriceItems 
        || customer.specialPriceItems.length === 0
      ) {
        console.log('test1');
        let allProducts = await Product.find({});
        let productCount = allProducts.length;
        if( productCount === 0 ) {
          // nothing to do
          customer.specialPriceItems = [];
        } else if( productCount === 1 ) {
          customer.specialPriceItems = [{
            productId: allProducts[0]._id,
            price: parseFloat(
              (allProducts[0].price * 0.90).toFixed(2)
            ) 
          }]
        } else if (productCount === 2) {
          customer.specialPriceItems = 
          [
            {
              productId: allProducts[0]._id,
              price: parseFloat(
                (allProducts[0].price * 0.90).toFixed(2)
              )
            },
            {
              productId: allProducts[1]._id,
              price: parseFloat(
                (allProducts[1].price * 0.90).toFixed(2)
              )
            },
          ]
        } else {
          let indexList = [];
          while( indexList.length < 2 ) {
            let randomIndex = Math.round(
              Math.random() * (productCount-1)
            );
            if ( 
              randomIndex < productCount 
              && indexList.indexOf(randomIndex) <= 0
            ) {
              indexList.push(randomIndex);
            }
          } // end of while loop
          customer.specialPriceItems = [];
          for( let i = 0; i< indexList.length; i++ ) {
            customer.specialPriceItems.push(
              {
                productId: allProducts[i]._id,
                price: parseFloat(
                  (allProducts[i].price * 0.90).toFixed(2)
                )
              },
            )
          }
          console.log('customerRouter -> signin -> customer ->', customer);
        }
        await customer.save();
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

// Add Address
router.post(
  "/address/add",
  authCustomerMiddleware,
  async (req, res) => {
    console.log('customerRouter -> addAddress -> customerId ->', req.customerId);
    try {
      const {
        definition,
        receiver,
        addressString,
        city
      } = req.body;
      const customer = await Customer.findById(req.customerId);
      if ( !customer ) {
        return res.status(404).json({ msg: 'User does not exist!' });
      }
      let addressList = customer.addressList 
        ? customer.addressList 
        : [];
      addressList.push({
        definition,
        receiver,
        addressString,
        city
      });
      customer.addressList = addressList;
      await customer.save();      
      return res.status(200).json({
        addressList: customer.addressList
      })
    } catch ( err ) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
); // End of  Add Address

// Get Features
router.get(
  "/feature",
  authCustomerMiddleware,
  async (req, res) => {
    console.log('customerRouter -> getFeatures -> customerId ->', req.customerId);
    try {
      const customer = await Customer.findById(req.customerId);
      if (!customer) {
        return res.status(404).json({ msg: 'User does not exist!' });
      }
      const featureList = await Feature.find({});
      console.log('customerRouter -> getFeatures -> featureList ->', featureList);
      res.status(200).json(
        featureList,
      );
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
);  // End of Get Features



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

// Get Products
router.get(
  "/product/get",
  authCustomerMiddleware,
  async (req, res) => {
    let orList = [];
    const productId = req.query.productId;
    if( productId ) {
      orList.push(
        { _id: productId }
      );
    }
    console.log('customerRouter -> Get Products -> productId ->', productId);
    const categoryId = req.query.categoryId;
    if (categoryId) {
      orList.push(
        { category: categoryId }
      );
    }
    console.log('customerRouter -> Get Products -> categoryId ->', categoryId);
    const brand = req.query.brand;
    if (brand) {
      orList.push(
        { brand }
      );
    }
    console.log('customerRouter -> Get Products -> brand ->', brand);    
    try {
      const productList = await Product.find({
        $or: [
          ...orList
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


// Add Order
router.post(
  "/order/add",
  authCustomerMiddleware,
  [  // Express Validator
    check("type", "Please select order Type!").isString(),
    // check("address", "Please enter your address").isString(),
    // check("address", "Please enter your address").notEmpty(),
    check("orderTotalPrice", "Please give information about Order Total Price!").isNumeric(),
    check("items", "Please include items list").isArray({
      min: 1
    }),
  ], // End of Express Validator 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const {
        type,
        items,
        orderTotalPrice,
        address,
        cardNumber,
        cvvCode,
        expiryDate, 
        cardHolder,
      } = req.body;
      console.log('customerRouter -> addOrder -> cardNumer + cvvCode + expiryDate ->', cardNumber, '+', cvvCode, '+', expiryDate );
      console.log('address -> ', address);
      console.log('items -> ', items);
      console.log('orderTotalPrice ->', orderTotalPrice);
      
      const order = new Order();
      if (
        type !== 'sell'
      ) {
        return res.status(400).json({
          errors: [{ msg: "Invalid Order Type!" }],
        });
      }
      order.type = type;
      const customer = await Customer.findById(req.customerId);
      if (!customer) {
        return res.status(404).json({ msg: 'User does not exist!' });
      }        
      order.customerId = req.customerId;
      order.address = address;
      const productOrList = items.map(
        (item) => {
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
      if (productList.length !== items.length) {
        return res.status(400).json({
          errors: [{ msg: "Invalid Product ID!" }],
        });
      }
      // Check if is there enough Stock for each item
      let orderSumCheckVariable = 0.00;
      let confirmedItemsList = [];
      for (let i = 0; i < items.length; i++) {
        if (!items[i].quantity) {
          return res.status(400).json({
            errors: [{ msg: "Invalid Quantity of Item!" }],
          });
        }
        if (!Number.isInteger(items[i].quantity)) {
          return res.status(400).json({
            errors: [{ msg: "Invalid Quantity of Item!" }],
          });
        }
        if (items[i].quantity <= 0) {
          return res.status(400).json({
            errors: [{ msg: "Invalid Quantity of Item!" }],
          });
        }
        let relatedProduct = productList.find(item => item.id === items[i].productId);
        if (
          relatedProduct.stockStatus.stockQuantity < items[i].quantity
        ) {
          return res.status(400).json({
            errors: [{ msg: `Quantity of Product with ID ${relatedProduct._id} is less than ${items[i].quantity}!` }],
          });
        }
        confirmedItemsList.push(
          {
            productId: relatedProduct._id,
            brand: relatedProduct.brand,
            productNo: relatedProduct.productNo,
            keyProperties: relatedProduct.keyProperties,
            mainImageId: relatedProduct.imageList.filter(
              image => image.isMain === true
            )[0].imageId,
            price: relatedProduct.price,
            quantity: items[i].quantity,
          }
        );
        orderSumCheckVariable += items[i].quantity * parseFloat(items[i].price.toFixed(2));
      }
      orderSumCheckVariable = parseFloat(orderSumCheckVariable.toFixed(2));
      if (orderSumCheckVariable !== orderTotalPrice) {
        console.log('orderSumCheckVariable & orderTotalPrice ->', orderSumCheckVariable.toString(), '+', orderTotalPrice.toString() );
        return res.status(400).json({
          errors: [{ msg: "Order Total Price does not match with Order List!" }],
        });
      }
      // Now save Products new quantities
      if (type === 'sell') {
        // Get Payment        
        const getPaymentResult = await getPayment({
          cardHolder,
          cardNumber,
          cvvCode,
          expiryDate,
        });        
        if (getPaymentResult.status === false) {
          return res.status(400).json({
            errors: [{ msg: getPaymentResult.msg }],
          });
        }
        customer.balance = customer.balance + orderTotalPrice;
        await customer.save();  // We have already got Credit Card Payment!
        // End of Get Payment 
        order.items = confirmedItemsList;
        order.orderTotalPrice = orderTotalPrice;
        order.address = address;
        await order.save();
        for (let i = 0; i < items.length; i++) {
          console.log('items ->', items);
          let relatedProduct = productList.find(item => item.id === items[i].productId);
          console.log('productList ->', productList);
          console.log('relatedProduct ->', relatedProduct);
          let stockStatus = relatedProduct.stockStatus;
          stockStatus = {
            ...stockStatus,
            stockQuantity: stockStatus.stockQuantity - items[i].quantity
          }
          relatedProduct.stockStatus = stockStatus;
          await relatedProduct.save();
        }
        customer.balance = customer.balance - orderTotalPrice;
        if ( !customer.orders ) {
          customer.orders = [];
        }
        customer.orders.push(
          {
            orderId: order._id
          }
        );
        await customer.save();
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
);  //   End of Add Order


// Get Orders
router.get(
  "/order/get",
  authCustomerMiddleware,
  async (req, res) => {
    console.log('customerRouter -> getOrders -> ');    
    try {    
      const customerId = req.customerId;  
      if ( !customerId  ) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
      }
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
      }
      const date = req.query.date;  //  "today" || "1week" || "1month"  || "3months"
      if(
        date !== "today" 
        && date !== "1week" 
        &&  date !== "1month" 
        && date !== "3months"
      ) {
        return res.status(400).json({ errors: [{ msg: 'Date Range not selected!' }] })
      }
      let d = new Date();
      switch (date) {
        case "today":
          d.setDate(d.getDate() - 1);
          break;
        case "1week":
          d.setDate(d.getDate() - 7);
          break;
        case "1month":
          d.setMonth(d.getMonth() - 1);
          break;
        case "3months":
          d.setMonth(d.getMonth() - 3);
          break;
      }
      d.setDate(d.getDate()-1);
      const orders = await Order.find({
        customerId,
        date: {
          $gte: d
        }
      });
      res.status(200).send(
        orders
      );

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);  //   End of Add Order


// Get Statistics
router.get(
  "/statistic",
  authCustomerMiddleware,
  async (req, res) => {
    console.log(req.query.type)
    console.log('customerRouter -> GetStatistic -> Type ->', req.query.type)
    try {
      const type = req.query.type;  // "sellStatistic" "topSellStatistic"   "allStatistics" 
      let orderAggregation;
      if (
        type !== "sellStatistic"
        && type !== "topSellStatistic"
        && type !== "allStatistics"
      ) {
        return res.status(400).json({
          errors: [{ msg: "Type Not Selected!" }],
        });
      }
      if (type === "topSellStatistic") {
        orderAggregation = await Order.aggregate([
          {
            $match: {
              type: 'sell'
            }
          },
          {
            $unwind: '$items'
          },
          {
            $group: {
              _id: '$items.productId',
              totalSellQuantity: {
                $sum: '$items.quantity'
              }
            }
          },
          {
            $sort: {
              totalSellQuantity: -1
            }
          }
        ])
        // return res.status(200).json(
        //   orderAggregation
        // );
      } else {
        orderAggregation = []; // to be updated in Future
      }
      if (req.query.populateProducts === 'yes') {
        let queryOrList = [];
        let maxCount = req.query.maxCount
          ? parseInt(req.query.maxCount.toString())
          : 15;
        maxCount = maxCount > orderAggregation.length
          ? orderAggregation.length
          : maxCount;
        for (let i = 0; i < maxCount; i++) {
          queryOrList.push(
            {
              _id: orderAggregation[i]._id
            }
          )
        }
        const productList = await Product.find({
          $or: [
            ...queryOrList
          ]
        });
        let responseList = [];
        if (maxCount === productList.length) {          
          for (let i = 0; i < maxCount; i++) {
            responseList.push(
              productList.find(
                item => item.id.toString() === orderAggregation[i]._id.toString()
              )
            );
          }
          console.log('customerRouter -> GetStatistic -> responseList ->', responseList);
          return res.status(200).json(
            responseList
          );
        }
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);








module.exports = router;
