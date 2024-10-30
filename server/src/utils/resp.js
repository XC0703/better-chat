const { StatusMap, SUCCESS_CODE } = require('./status');

const respHttp = (res, respCode, data) => {
	const resp = {
		code: SUCCESS_CODE,
		data: '',
		message: 'success'
	};
	resp.code = respCode;
	resp.data = data || '';
	resp.message = StatusMap[respCode] || 'success';
	res.json(resp);
};
// 请求成功
const RespSuccess = res => {
	respHttp(res, SUCCESS_CODE);
};
// 请求失败
const RespError = (res, respCode) => {
	respHttp(res, respCode);
};
// 请求成功且返回数据
const RespData = (res, data, respCode) => {
	respHttp(res, respCode || SUCCESS_CODE, data);
};
module.exports = {
	RespSuccess,
	RespError,
	RespData
};
