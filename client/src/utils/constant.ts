export enum HttpStatus {
	SUCCESS = 200,
	ALL_EXIT_ERR = 4001, // 你邀请的好友都已经加入群聊
	FILE_EXIST = 6001, // 文件已存在
	ALL_CHUNK_UPLOAD = 6002 // 已完成所有分片上传，请合并文件
}
