const express = require('express');
const {register, login, logout, getMe} = require('../controllers/auth');

const router = express.Router();

const {protect} = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe); // ก่อนที่ดึงข้อมูล current user via getme() ต้องผ่าน protect() ก่อนว่า access ได้มั้ย ถ้าได้จึงจะ get ได้

module.exports = router;