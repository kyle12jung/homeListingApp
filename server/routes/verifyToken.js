const jwt = require('jsonwebtoken')
require('dotenv').config();
const secretKey = process.env.SECRETKEY;

module.exports = function(req, res, next) {
    const token = req.header('auth-token')
    if (!token) return res.status(401).send('Access denied')

    try {
        const verified = jwt.verify(token, secretKey)
        req.user = verified
        next()
    } catch {
        res.status(400).send('Invalid token')
    }
}