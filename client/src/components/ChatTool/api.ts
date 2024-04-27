import { IGroupMemberParams, IGroupMember } from './type';

import Request from '@/utils/request';

// 获取群聊成员信息（用于音视频通话）
export const getGroupMembers = async (params: IGroupMemberParams) => {
	const res = await Request.get<IGroupMember[]>(
		`group/group_member/?group_id=${params.groupId}&room=${params.room}`
	);
	return res.data;
};
