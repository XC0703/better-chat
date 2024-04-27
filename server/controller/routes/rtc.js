const express = require('express');
const router = express.Router();
const rtc = require('../../services/rtc/index');
const authenticate = require('../../utils/authenticate');

module.exports = () => {
	router.ws('/connect', rtc.connectRTC);
	router.get('/room_members', authenticate.authenticateToken, rtc.getRoomMembers);
	return router;
};
