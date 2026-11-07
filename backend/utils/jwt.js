const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'hirematch_super_secure_jwt_secret_key_2026_mca_project_key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'hirematch_super_secure_jwt_secret_key_2026_mca_project_key');
};

module.exports = {
  generateToken,
  verifyToken,
};
