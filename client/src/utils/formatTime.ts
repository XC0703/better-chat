import dayjs from "dayjs";

// 枚举表示五种消息类型
export enum MESSAGE_TYPE {
  NEW_MESSAGE = 1, //新消息
  TODAY_MESSAGE, //当天消息
  YESTERDAY_MESSAGE, //昨天消息
  THIS_YEAR_MESSAGE, //今年消息
  OTHER_MESSAGE, //其他消息
}

//判断消息类型
// getDateDiff 函数接收一个日期参数 date，根据该日期与当前时间的关系，返回一个表示消息类型的数字。
// 根据不同的情况，返回的类型有所不同，包括1、2、3、4和5。其中，1表示新消息，2表示当天消息，3表示昨天消息，4表示今年消息，5表示其他消息。
const getDateDiff = (date:Date) => {
  const nowDate = dayjs(new Date()); //当前时间
  const oldDate = dayjs(new Date(date)); //参数时间
  let result;
  if (nowDate.year() - oldDate.year() >= 1) {
    result = MESSAGE_TYPE.OTHER_MESSAGE;
  } else if (nowDate.month() - oldDate.month() >= 1 || nowDate.date() - oldDate.date() >= 2) {
    result = MESSAGE_TYPE.THIS_YEAR_MESSAGE;
  } else if (nowDate.date() - oldDate.date() >= 1) {
    result = MESSAGE_TYPE.YESTERDAY_MESSAGE;
  } else if ( nowDate.hour() - oldDate.hour() >= 1 || nowDate.minute() - oldDate.minute() >= 5) {
    result = MESSAGE_TYPE.TODAY_MESSAGE;
  } else {
    result = MESSAGE_TYPE.NEW_MESSAGE;
  }
  return result;
}

// 格式化时间--用于聊天列表
// toggleTime_chatList 函数与 toggleTime_chatContent 函数相似，也是接收一个日期参数 date，根据该日期与当前时间的关系，返回一个字符串表示的时间。
// 不同的是，它返回的时间格式有所不同，包括"刚刚"、"H:mm"、"昨天"、"M月D日"和"YYYY年M月D日"。
export const toggleTime_chatList = (date:Date) => {
  let time;
  const type = getDateDiff(date);
  switch (type) {
      case MESSAGE_TYPE.NEW_MESSAGE:
          time = "刚刚"; //新消息，不显示时间，但是要显示"以下为最新消息"
          break;
      case MESSAGE_TYPE.TODAY_MESSAGE:
          time = dayjs(date).format("H:mm"); //当天消息，显示：10:22
          break;
      case MESSAGE_TYPE.YESTERDAY_MESSAGE:
          time = "昨天"; //昨天消息，显示：昨天
          break;
      case MESSAGE_TYPE.THIS_YEAR_MESSAGE:
          time = dayjs(date).format("M月D日"); //今年消息，显示：3月17日
          break;
      case MESSAGE_TYPE.OTHER_MESSAGE:
          time = dayjs(date).format("YYYY年M月D日"); //其他消息，显示：2020年11月2日
          break;
  }
  return time;
}

// 格式化时间--用于聊天内容
// toggleTime_chatContent 函数接收一个日期参数 date，根据该日期与当前时间的关系，返回一个字符串表示的时间。
// 根据不同的情况，返回的时间格式有所不同，包括"刚刚"、"H:mm"、"昨天 H:mm"、"M月D日 AH:mm"和"YYYY年M月D日 AH:mm"。
export const toggleTime_chatContent = (date:Date) => {
    let time = '';
    const type = getDateDiff(date);
    switch (type) {
        case MESSAGE_TYPE.NEW_MESSAGE:
            time = "刚刚"; //新消息，不显示时间，但是要显示"以下为最新消息"
            break;
        case MESSAGE_TYPE.TODAY_MESSAGE:
            time = dayjs(date).format("H:mm"); //当天消息，显示：10:22
            break;
        case MESSAGE_TYPE.YESTERDAY_MESSAGE:
            time = dayjs(date).format("昨天 H:mm"); //昨天消息，显示：昨天 20:41
            break;
        case MESSAGE_TYPE.THIS_YEAR_MESSAGE:
            time = dayjs(date)
                .format("M月D日 AH:mm")
                .replace("AM", "上午")
                .replace("PM", "下午"); //今年消息，上午下午，显示：3月17日 下午16:45
            break;
        case MESSAGE_TYPE.OTHER_MESSAGE:
            time = dayjs(date)
                .format("YYYY年M月D日 AH:mm")
                .replace("AM", "上午")
                .replace("PM", "下午"); //其他消息，上午下午，显示：2020年11月2日 下午15:17
            break;
    }
    return time;
}
