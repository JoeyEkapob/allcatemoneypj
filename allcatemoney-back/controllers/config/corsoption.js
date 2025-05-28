const allowedOrigins = process.env.NODE_ENV === 'production' ? ['https://yourdomain.com',] : ['http://localhost:5173'];

 const corsoption = {
    origin: function (origin, callback) {
 
     if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
    },
      credentials: true
};

module.exports = corsoption;
