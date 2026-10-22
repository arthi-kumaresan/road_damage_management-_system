const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret_jwt_key_road_proj_2026', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
