const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

// Routers
const categoryRouter = require('./routes/api/category');
const productRouter = require('./routes/api/product');
const adminAuthRouter = require('./routes/api/adminAuth');
const customerAuthRouter = require('./routes/api/customer');



const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));


// Define routes
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use("/api/admin-auth", adminAuthRouter);
app.use("/api/customer-auth", customerAuthRouter);

// WE ARE COMMENTING TO BE ABLE TO UPLOAD TO HEROKU
app.get('/', (req, res) => {
  res.send('API RUNNING')
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});