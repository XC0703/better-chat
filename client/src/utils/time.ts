import dayjs from 'dayjs';

// 枚举表示五种消息类型
export enum MessageType {
	NEW_MESSAGE = 1, // 新消息
	TODAY_MESSAGE, // 当天消息
	YESTERDAY_MESSAGE, // 昨天消息
	THIS_YEAR_MESSAGE, // 今年消息
	OTHER_MESSAGE // 其他消息
}

// 判断消息类型
// getDateDiff 函数接收一个日期参数 date，根据该日期与当前时间的关系，返回一个表示消息类型的数字。
// 根据不同的情况，返回的类型有所不同，包括 1、2、3、4 和 5。其中，1 表示新消息，2 表示当天消息，3 表示昨天消息，4 表示今年消息，5 表示其他消息。
const getDateDiff = (date: Date) => {
	const nowDate = dayjs(new Date()); // 当前时间
	const oldDate = dayjs(new Date(date)); // 参数时间
	let result;
	if (nowDate.year() - oldDate.year() >= 1) {
		result = MessageType.OTHER_MESSAGE;
	} else if (nowDate.month() - oldDate.month() >= 1 || nowDate.date() - oldDate.date() >= 2) {
		result = MessageType.THIS_YEAR_MESSAGE;
	} else if (nowDate.date() - oldDate.date() >= 1) {
		result = MessageType.YESTERDAY_MESSAGE;
	} else if (nowDate.hour() - oldDate.hour() >= 1 || nowDate.minute() - oldDate.minute() >= 5) {
		result = MessageType.TODAY_MESSAGE;
	} else {
		result = MessageType.NEW_MESSAGE;
	}
	return result;
};

// 格式化时间 -- 用于聊天列表
// formatChatListTime 函数与 formatChatContentTime 函数相似，也是接收一个日期参数 date，根据该日期与当前时间的关系，返回一个字符串表示的时间。
// 不同的是，它返回的时间格式有所不同，包括 "刚刚"、"H:mm"、"昨天"、"M 月 D 日" 和 "YYYY 年 M 月 D 日"。
export const formatChatListTime = (date: Date) => {
	let time;
	const type = getDateDiff(date);
	switch (type) {
		case MessageType.NEW_MESSAGE:
			time = '刚刚'; // 新消息，不显示时间，但是要显示 "以下为最新消息"
			break;
		case MessageType.TODAY_MESSAGE:
			time = dayjs(date).format('H:mm'); // 当天消息，显示：10:22
			break;
		case MessageType.YESTERDAY_MESSAGE:
			time = '昨天'; // 昨天消息，显示：昨天
			break;
		case MessageType.THIS_YEAR_MESSAGE:
			time = dayjs(date).format('M 月 D 日'); // 今年消息，显示：3 月 17 日
			break;
		case MessageType.OTHER_MESSAGE:
			time = dayjs(date).format('YYYY 年 M 月 D 日'); // 其他消息，显示：2020 年 11 月 2 日
			break;
	}
	return time;
};

// 格式化时间 -- 用于聊天内容
// formatChatContentTime 函数接收一个日期参数 date，根据该日期与当前时间的关系，返回一个字符串表示的时间。
// 根据不同的情况，返回的时间格式有所不同，包括 "刚刚"、"H:mm"、"昨天 H:mm"、"M 月 D 日 AH:mm" 和 "YYYY 年 M 月 D 日 AH:mm"。
export const formatChatContentTime = (date: Date) => {
	let time = '';
	const type = getDateDiff(date);
	switch (type) {
		case MessageType.NEW_MESSAGE:
			time = '刚刚'; // 新消息，不显示时间，但是要显示 "以下为最新消息"
			break;
		case MessageType.TODAY_MESSAGE:
			time = dayjs(date).format('H:mm'); // 当天消息，显示：10:22
			break;
		case MessageType.YESTERDAY_MESSAGE:
			time = dayjs(date).format('昨天 H:mm'); // 昨天消息，显示：昨天 20:41
			break;
		case MessageType.THIS_YEAR_MESSAGE:
			time = dayjs(date).format('M 月 D 日 AH:mm').replace('AM', '上午').replace('PM', '下午'); // 今年消息，上午下午，显示：3 月 17 日 下午 16:45
			break;
		case MessageType.OTHER_MESSAGE:
			time = dayjs(date)
				.format('YYYY 年 M 月 D 日 AH:mm')
				.replace('AM', '上午')
				.replace('PM', '下午'); // 其他消息，上午下午，显示：2020 年 11 月 2 日 下午 15:17
			break;
	}
	return time;
};

// 格式化时间 -- 用于展示音视频通话时长
export const formatCallTime = (duration: number) => {
	const hour =
		duration / 3600 < 10 ? '0' + Math.floor(duration / 3600) : Math.floor(duration / 3600);
	const minute =
		(duration % 3600) / 60 < 10
			? '0' + Math.floor((duration % 3600) / 60)
			: Math.floor((duration % 3600) / 60);
	const second = duration % 60 < 10 ? '0' + Math.floor(duration % 60) : Math.floor(duration % 60);
	const broadcastTime = hour + ':' + minute + ':' + second;
	return broadcastTime;
};
