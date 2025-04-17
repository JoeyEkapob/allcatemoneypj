const allowedOrigins = process.env.NODE_ENV === 'production' ? ['https://yourdomain.com'] : ['http://localhost:5173'];

export const corsoption = {
    origin: function (origin, callback) {
      /*   console.log(allowedOrigins.includes(origin))
        console.log(!origin) */
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
};
