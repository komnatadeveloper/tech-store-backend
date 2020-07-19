const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");
const Product = require("../../models/Product");
const Order = require("../../models/Order");


// Middleware
const authAdminMiddleware = require("../../middleware/authAdmin");

// Get Statistics
router.get(
  "/statistic",
  authAdminMiddleware,
  async (req, res) => {
    console.log(req.query.type)
    console.log('StatisticRouter -> GetStatistic -> Type ->', req.query.type)
    try {  
      const type = req.query.type;  // "sellStatistic" "topSellStatistic"   "allStatistics" 
      let orderAggregation;
      if(
        type !== "sellStatistic"
        && type !== "topSellStatistic"
        && type !== "allStatistics"
      ) {
        return res.status(400).json({
          errors: [{ msg: "Type Not Selected!" }],
        });
      }
      if (type === "topSellStatistic" ) {        
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
      }  else {
        orderAggregation = []; // to be updated in Future
      }
      if( req.query.populateProducts === 'yes' ) {
        let queryOrList = [];
        let maxCount = req.query.maxCount 
          ? parseInt(req.query.maxCount.toString())
          : 200;
        maxCount = maxCount > orderAggregation.length
          ? orderAggregation.length
          : maxCount;
        for (let i = 0; i < maxCount; i++ ) {
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
        // console.log('StatisticRouter -> GetStatistic -> productList ->', productList)
        let responseList = [];
        if (maxCount === productList.length ) {
          for(let i = 0 ; i < maxCount; i++ ) {            
            responseList.push(
              {
                totalSellQuantity: orderAggregation[i].totalSellQuantity,
                product: productList.find(
                  item => item.id.toString() === orderAggregation[i]._id.toString()
                )
              }
            );
          }
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