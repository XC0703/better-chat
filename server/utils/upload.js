/* global RespData RespError */
const { base64ToImage } = require('./file');
const { RespServerErr } = require('../model/error');
module.exports = {
	UploadImage
};
/**
 * 文件上传的处理，目前只处理图片上传。（TODO：后期文件上传完善后，可以考虑合并在一起）
 */

/**
 * 上传图片的接口 —— 将图片的 base64 编码字符串传给后端，后端将文件存在服务器后再将文件 URL 返回
 */
async function UploadImage(req, res) {
	try {
		const { base64 } = req.body;
		const filePath = base64ToImage(base64);
		const results = {
			filePath
		};
		return RespData(res, results);
	} catch {
		return RespError(res, RespServerErr);
	}
}
