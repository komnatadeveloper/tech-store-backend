const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("token");
  console.log('authCustomerMiddleware -> token -> ', token )

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      msg: "No token, authorization denied",
    });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    console.log( 'authCustomerMiddleware -> decoded.id -> ', decoded.user.id)
    req.customerId = decoded.user.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
