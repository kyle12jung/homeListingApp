const express = require('express')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router()

const User = require('../models/User')

require('dotenv').config();
const secretKey = process.env.SECRETKEY;

const validate = [
    check('fullName')
    .isLength({ min: 2 })
    .withMessage('Your full name is required'),
    check('email')
    .isEmail()
    .withMessage('Please provide a vaild email'),
    check('password')
    .isLength({ min: 8 })
    .withMessage('Your password should be at least 8 characters')
]

const loginValidate = [
    check('email')
    .isEmail()
    .withMessage('Please provide a vaild email'),
    check('password')
    .isLength({ min: 8 })
    .withMessage('Your password should be at least 8 characters')
]

const generateToken = (user) => {
    return jwt.sign({ _id: user._id, email: user.email, fullName: user.fullName }, secretKey)
}

router.post('/register', validate, async(req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userExist = await User.findOne({ email: req.body.email })
    if (userExist) return res.status(400).send({
        success: false,
        message: "Email already exists"
    })

    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashPassword,
    })

    try {
        const saveduser = await user.save()

        const token = generateToken(user)
        res.send({
            success: true,
            data: {
                id: saveduser._id,
                fullName: saveduser.fullName,
                email: saveduser.email
            },
            token
        })
    } catch (err) {
        res.status(400).send({ success: false, err })
    }
})

router.post('/login', loginValidate, async(req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(404).send({
        success: false,
        message: "User not registered"
    })

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(404).send({
        success: false,
        message: "Invalid Email or Password"
    })

    // create and assign a token
    const token = generateToken(user)

    res.header('auth-token', token).send({ success: true, message: "Logged in", token })
})

module.exports = router