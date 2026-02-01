const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173"
  // add production frontend URL here later
  // "https://myapp.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    }
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With"
  ],

  exposedHeaders: [
    "Set-Cookie",
    "X-Total-Count"
  ],

  credentials: true,
  optionsSuccessStatus: 204
};

module.exports = cors(corsOptions);
