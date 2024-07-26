import { request } from '../request';

// 课程列表
export function getAllLesson(params?: Api.SystemManage.LessonSearchParams) {
  return request<Lesson>({
    url: `/Lesson/AllLesson`,
    method: 'get',
    params
  });
}

// 课程上课记录列表
export function reportForLesson(params?: Api.SystemManage.AttendanceSearchParams) {
  return request<Lesson>({
    url: `/Attendance/ForLesson`,
    method: 'get',
    params
  });
}

// 获取单个课程
export function getLesson(data?: any) {
  return request<Lesson>({
    url: `/Lesson/Get?id=${data}`,
    method: 'get'
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

// 搜索课程
export function searchLesson(keyboard: string) {
  return request<Lesson>({
    url: `/Lesson/Search?keyword=${keyboard}`,
    method: 'get'
  });
}

// 全部课程
export function allLesson() {
  return request<Lesson>({
    url: `/Lesson/All`,
    method: 'get'
  });
}
