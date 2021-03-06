const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

// Routers
const categoryRouter = require('./routes/api/categoryRouter');
const productRouter = require('./routes/api/productRouter');
const adminAuthRouter = require('./routes/api/adminAuth');
const customerRouter = require('./routes/api/customerRouter');
const featureRouter = require('./routes/api/featureRouter');
const supplierRouter = require('./routes/api/supplierRouter');
const orderRouter = require('./routes/api/orderRouter');
const statisticRouter = require('./routes/api/statisticRouter');



const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));


// Define routes
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use("/api/admin-auth", adminAuthRouter);
app.use("/api/customer", customerRouter);
app.use("/api/feature", featureRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/order", orderRouter);
app.use("/api/statistic", statisticRouter);

// WE ARE COMMENTING TO BE ABLE TO UPLOAD TO HEROKU
app.get('/', (req, res) => {
  res.send('API RUNNING')
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});