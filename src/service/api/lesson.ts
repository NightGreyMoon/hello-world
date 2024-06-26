import { request } from '../request';

// 课程列表
export function getAllLesson(params?: Api.SystemManage.CommonSearchParams) {
  return request<SysRoleList>({
    url: `/Lesson/All`,
    method: 'get',
    params
  });
}

// 禁用课程
export function disableLesson(data?: any) {
  return request<boolean>({
    url: `/Lesson/Delete?id=${data}`,
    method: 'get'
  });
}

// 启用课程
export function enableLesson(data?: any) {
  return request<boolean>({
    url: `/Lesson/UnDelete?id=${data}`,
    method: 'get'
  });
}

// 新增课程
export function addLesson(data?: any) {
  return request<boolean>({
    url: '/Lesson/Add',
    method: 'post',
    data
  });
}

// 修改课程
export function updateLesson(data?: any) {
  return request<boolean>({
    url: '/Lesson/Update',
    method: 'post',
    data
  });
}
