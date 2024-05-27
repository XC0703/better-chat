const express = require('express');
const router = express.Router();
const auth = require('../../service/auth/index');
const authenticate = require('../../utils/authenticate');
const upload = require('../../utils/upload');

module.exports = () => {
	router.post('/login', auth.login);
	router.post('/logout', auth.logout);
	router.post('/register', auth.register);
	router.post('/forget_password', auth.forgetPassword);
	router.post('/update_info', authenticate.authenticateToken, auth.updateInfo);
	router.post('/upload_image', authenticate.authenticateToken, upload.uploadImage);
	router.ws('/user_channel', auth.initUserNotification);
	return router;
};
