const express = require('express');
const router = express.Router();
const friend = require('../../service/friend/index');
const authenticate = require('../../utils/authenticate');

module.exports = () => {
	router.get('/friend_list', authenticate.authenticateToken, friend.getFriendList);
	router.get('/group_list', authenticate.authenticateToken, friend.getFriendGroupList);
	router.get('/friend_id', authenticate.authenticateToken, friend.getFriendById);
	router.get('/search_user', authenticate.authenticateToken, friend.searchUser);
	router.post('/create_group', authenticate.authenticateToken, friend.createFriendGroup);
	router.post('/add_friend', authenticate.authenticateToken, friend.addFriend);
	router.post('/update_friend', authenticate.authenticateToken, friend.updateFriend);
	return router;
};
