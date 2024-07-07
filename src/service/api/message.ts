import { request } from '../request';
import type { MessageLog } from '../../typings/api';

// 搜索消息历史记录
export function getAllMessage(params?: Api.SystemManage.ScoreSearchParams) {
  return request<MessageLog>({
    url: `/Message/All`,
    method: 'get',
    params
  });
}
