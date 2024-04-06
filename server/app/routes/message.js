const express = require('express');
const router = express.Router();
const message = require('../../container/message/index');
const authenticate = require('../../utils/authenticate');

module.exports = () => {
	router.get('/chat_list', authenticate.authenticateToken, message.getChatList);
	router.ws('/connect_chat', message.connectChat);
	return router;
};
