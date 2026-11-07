/**
 * Standardized API response format
 */
const sendResponse = (res, statusCode, success, message, data = null, meta = null) => {
  const payload = {
    success,
    message,
    ...(data !== null && { data }),
    ...(meta !== null && { meta }),
  };
  return res.status(statusCode).json(payload);
};

const sendSuccess = (res, data = null, message = 'Success', statusCode = 200, meta = null) => {
  return sendResponse(res, statusCode, true, message, data, meta);
};

const sendError = (res, message = 'An error occurred', statusCode = 500, error = null) => {
  const payload = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && error && { debug: error.message || error }),
  };
  return res.status(statusCode).json(payload);
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendError,
};
