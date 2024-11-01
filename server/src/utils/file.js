const fs = require('fs');

// 随机生成文件名
const generateRandomString = length => {
	let result = '';
	const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

// 判断指定目录是否存在, 不存在则创建
const notExitCreate = dir => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
};

// 根据文件名获取文件类型
const getFileSuffixByName = filename => {
	const fileSuffix = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
	switch (fileSuffix) {
		case 'avi':
		case 'mpeg':
		case 'wmv':
		case 'mov':
		case 'flv':
		case 'mp4':
			return 'video';
		case 'png':
		case 'jpeg':
		case 'jpg':
		case 'gif':
		case 'webp':
		case 'svg':
			return 'image';
		default:
			return 'file';
	}
};

module.exports = {
	generateRandomString,
	notExitCreate,
	getFileSuffixByName
};
