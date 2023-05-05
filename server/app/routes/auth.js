var express = require('express');
const router = express.Router();
const auth = require("../../container/auth/index")
module.exports = function () {
    router.post('/login', auth.Login)
    router.post('/register', auth.Register)
    return router
}