const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = await Employee.findById(decoded.id);
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    
    next();
  } catch (e) {
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Note: Here we'd typically check req.user.role if it's a string, 
    // but in this system role is an Object (roleId). 
    // We might need to check the role name or specific permissions.
    if (!req.user.roleId || !roles.includes(req.user.roleId.name)) {
      return res.status(403).json({ success: false, message: 'Permission denied' });
    }
    next();
  };
};
