const { ErrStatusMap } = require('./error');

const respHttp = (res, respCode, data) => {
	const resp = {
		code: 200,
		data: '',
		message: 'success'
	};
	if (respCode !== 200) {
		resp.code = respCode;
		resp.message = ErrStatusMap[respCode];
	} else {
		resp.data = data;
	}
	res.json(resp);
};
// 请求成功
const RespSuccess = res => {
	respHttp(res, 200);
};
// 请求失败
const RespError = (res, respCode) => {
	respHttp(res, respCode);
};
// 请求成功且返回数据
const RespData = (res, data) => {
	respHttp(res, 200, data);
};
module.exports = {
	RespSuccess,
	RespError,
	RespData
};
