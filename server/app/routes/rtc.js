const express = require("express");
const router = express.Router();
const rtc = require("../../container/rtc/index");

module.exports = function () {
  router.ws("/single", rtc.singleRTCConnect);
  return router;
};
