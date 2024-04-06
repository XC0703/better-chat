const express = require('express');
const router = express.Router();
const group = require('../../container/group/index');
const authenticate = require('../../utils/authenticate');

module.exports = () => {
	router.get('/group_list', authenticate.authenticateToken, group.getGroupChatList);
	router.get('/search_group', authenticate.authenticateToken, group.searchGroupChat);
	router.get('/group_info', authenticate.authenticateToken, group.getGroupChatInfo);
	router.post('/create_group', authenticate.authenticateToken, group.createGroupChat);
	router.post('/invite_friend', authenticate.authenticateToken, group.inviteFriendToGroupChat);
	router.post('/add_group', authenticate.authenticateToken, group.joinGroupChat);
	return router;
};
