const { sendError } = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    return sendError(res, message, 404);
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for ${field}. Please use another value.`;
    return sendError(res, message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return sendError(res, messages.join(', '), 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token. Authorization denied.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired. Please log in again.', 401);
  }

  // Multer error
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 'File size exceeds maximum allowed limit (5MB).', 400);
    }
    return sendError(res, `Upload error: ${err.message}`, 400);
  }

  return sendError(res, error.message || 'Server Internal Error', error.statusCode || 500, err);
};

module.exports = errorHandler;

