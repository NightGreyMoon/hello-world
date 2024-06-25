import { request } from '../request';

// 新增报课记录
export function addEnrollment(data?: any) {
  return request<boolean>({
    url: '/Enrollment/Add',
    method: 'post',
    data
  });
}

// 搜索报课记录
export function getAllEnrollment(params?: Api.SystemManage.EnrollmentSearchParams) {
  return request<SysRoleList>({
    url: `/Enrollment/All`,
    method: 'get',
    params
  });
}

// 更新报课记录
export function updateEnrollment(data?: any) {
  return request<boolean>({
    url: '/Enrollment/Update',
    method: 'post',
    data
  });
}

// 获取在读课程
export function getEnrollmentForStudent(id: number) {
  return request<EnrolledLesson>({
    url: `/Enrollment/EnrolledLessons?id=${id}`,
    method: 'get'
  });
}
