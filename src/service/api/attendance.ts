import { request } from '../request';

// 获取上课记录的评语
export function getComment(id?: number) {
  return request<boolean>({
    url: `/Attendance/GetComment?id=${id}`,
    method: 'get'
  });
}

// 更新上课记录的请假状态
export function udpateCancel(id?: number) {
  return request<boolean>({
    url: `/Attendance/Cancel?id=${id}`,
    method: 'get'
  });
}
