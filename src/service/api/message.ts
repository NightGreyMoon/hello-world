import { request } from '../request';

// 搜索消息历史记录
export function getAllMessage(params?: Api.SystemManage.ScoreSearchParams) {
  return request<SysRoleList>({
    url: `/Message/All`,
    method: 'get',
    params
  });
}
