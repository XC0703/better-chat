const express = require('express');
const router = express.Router();
const rtc = require('../../services/rtc/index');

module.exports = () => {
	router.ws('/single', rtc.singleRTCConnect);
	return router;
};
