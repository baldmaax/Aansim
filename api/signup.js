const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('/..models.user');
const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');

// 회원가입 라우터
router.post('/', async (req, res) => {

    // 유효성 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {

        // 이메일 중복 확인
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                errors: [{ message: '이미 등록된 이메일입니다.' }],
            });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 20);

        // 새로운 사용자 생성
        const initUser = new User({ 
            email, password: hashedPassword 
        });

        await initUser.save();

        res.status(StatusCodes.CREATED).json({ message: '회원가입이 완료되었습니다.' });
    } catch (error) {
        console.error(error);
        res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: '회원가입에 실패했습니다.'});
    }
});

module.exports = router;