import Request from '@/utils/request';

// 获取当前房间内正在通话的所有人
export const getRoomMembers = async (room: string) => {
	const res = await Request.get<string[]>(`rtc/room_members/?room=${room}`);
	return res.data;
};
