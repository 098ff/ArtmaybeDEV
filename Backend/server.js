const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db");
// Require Sanitizer for not allow Nosql query when calls apis
const mongoSanitize = require('@exortek/express-mongo-sanitize');
// Require Helmet for more security headers
const helmet = require('helmet');
// Require XSS for not allow 'script' from Hacker when POST apis
const {xss} = require('express-xss-sanitizer');
// Require RateLimit for limit number of calling apis
const rateLimit = require('express-rate-limit');
// Require HPP for not allow param pollution
const hpp = require('hpp');
// Require cors for enable React to communicate with Nodejs
const cors = require('cors');

dotenv.config({path: './config/config.env'});
const app = express();

// Query parser เพิ่มเพราะให้ express รองรับ query parameter ที่ซับซ้อนมากขึ้น โดยเรียกใช้ lib qs ตอนทำ Relationships
app.set('query parser', 'extended');

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Mongo Sanitizer
app.use(mongoSanitize());

// Helmet
app.use(helmet());

// XSS
app.use(xss());

// Rate Limit
const limiter = rateLimit({
    windowsMs: 10*60*1000, // 10 mins
    max: 100
});
app.use(limiter);

// HPP
app.use(hpp());

// Cors
app.use(cors());

connectDB();

// TODO: Route files
const auth = require('./routes/auth');
const companies = require('./routes/companies');
const favorites = require('./routes/favorites');

// TODO: Mount routers
app.use(`/api/v1/auth`, auth);
app.use(`/api/v1/companies`, companies);
app.use(`/api/v1/favorites`, favorites);

// Use || 5000 for running in window
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(
        `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
});

process.on("unhandledRejection", (err, promise) => {
    console.log(`Unhandled Rejection at: ${promise}, reason: ${err}`);
    server.close(() => process.exit(1));
});