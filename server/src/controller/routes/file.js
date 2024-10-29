const express = require('express');
const multer = require('multer');
const router = express.Router();
const file = require('../../service/file/index');
const authenticate = require('../../utils/authenticate');

module.exports = () => {
	router.post('/verify_file', authenticate.authenticateToken, file.verifyFile);
	router.post(
		'/upload_chunk',
		authenticate.authenticateToken,
		multer({
			limits: { fileSize: 10 * 1024 * 1024 }
		}).single('chunk'),
		file.uploadChunk
	);
	router.post('/merge_chunk', authenticate.authenticateToken, file.mergeFile);
	return router;
};
