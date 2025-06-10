const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  
   const token = req.cookies.token;
console.log(token)

 if (!token) {
    return res.status(401).json({
      success: false,
      type: 'missing',
      message: 'ไม่พบ token กรุณาเข้าสู่ระบบ',
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {

     if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        type: 'expired',
        message: 'Session หมดอายุ ',
      });
    }

    // ✅ token ผิดหรือปลอม
    return res.status(401).json({
      success: false,
      type: 'invalid',
      message: 'Token ไม่ถูกต้องหรือไม่สามารถตรวจสอบได้',
    });
  }
};
module.exports = authMiddleware;
