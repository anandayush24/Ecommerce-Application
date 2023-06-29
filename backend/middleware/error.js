//importing required documents
const ErrorHandler = require("../utils/errorHandler")

module.exports = (err, rq, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //wrong mongodb id error
  if (err.name === "castError") {
    const message = `resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${(object, keys(err.keyValue))} entered`;
    err = new ErrorHandler(message, 400);
  }

  //wrong JWT token error
  if (err.code === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  //JWT expire error
  if (err.code === "TokenExpiredError") {
    const message = `Json Web Token is expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    //error: err //return just the error number
    //error: err.stack //returns the error with details
    message: err.message,
  });
};