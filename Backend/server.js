const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db");
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

app.use(cors());

connectDB();

// TODO: Route files
const auth = require('./routes/auth');
const companies = require('./routes/companies');

// TODO: Mount routers
app.use(`/api/v1/auth`, auth);
app.use(`/api/v1/companies`, companies);

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