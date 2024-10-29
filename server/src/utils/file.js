/* global Buffer process */
const path = require('path');
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

// 将 base64 字符串转化为图片并存储在文件目录中
const base64ToImage = base64String => {
	// 去除 Base64 URL 的头部（如'data:image/png;base64,'）以获取纯粹的 Base64 编码数据
	const base64Data = base64String.replace(/^data:([A-Za-z-+/]+);base64,/, '');
	// 将 Base64 编码的字符串转换成 Buffer 对象
	const dataBuffer = Buffer.from(base64Data, 'base64');
	// 创建目录
	const mimeType = base64String.match(/^data:(image\/\w+);base64,/)[1];
	const mimeParts = mimeType.split('/')[1];
	const outputPath = `/uploads/image`;
	notExitCreate(path.join(process.cwd(), outputPath));
	// 使用  fs.writeFileSync 方法将 Buffer 对象写入到指定的文件路径
	const filePath = `${outputPath}/${generateRandomString(32)}.${mimeParts}`;
	fs.writeFileSync(path.join(process.cwd(), filePath), dataBuffer);
	return filePath;
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
	base64ToImage,
	getFileSuffixByName
};
