import { request } from '../request';

// 获取上课记录的评语
export function getComment(id?: number) {
  return request<boolean>({
    url: `/Attendance/GetComment?id=${id}`,
    method: 'get'
  });
}

// 更新上课记录的请假状态
export function udpateCancel(id?: number, cancelReason: string) {
  return request<boolean>({
    url: `/Attendance/Cancel?id=${id}&reason=${cancelReason}`,
    method: 'get'
  });
}

export function addAttendance(data?: any) {
  return request<boolean>({
    url: '/Attendance/Add',
    method: 'post',
    data
  });
}

// 移除上课记录
export function deleteAttendance(id?: number) {
  return request<boolean>({
    url: `/Attendance/Delete?id=${id}`,
    method: 'get'
  });
}
