import { request } from '../request';

/** 获取账户已确认绑定的学生列表 */
export function getConfirmedStudents() {
  return request<Student>({
    url: `/Student/AllStudentForUser`,
    method: 'get'
  });
}

/** 获取当前账户待确认绑定的学生列表 */
export function getUnConfirmedStudents() {
  return request<Student>({
    url: `/Student/StudentToConfirm`,
    method: 'get'
  });
}

/** 为当前账户待确认绑定学生 */
export function confirmStudent(id: number) {
  return request<Student>({
    url: `/Student/ConfirmStudent?id=${id}`,
    method: 'get'
  });
}

// 新增学生
export function addStudent(data?: any) {
  return request<boolean>({
    url: '/Student/Add',
    method: 'post',
    data
  });
}

// 修改学生
export function updateStudent(data?: any) {
  return request<boolean>({
    url: '/Student/Update',
    method: 'post',
    data
  });
}

// 禁用学生
export function disableStudent(data?: any) {
  return request<boolean>({
    url: `/Student/Delete?id=${data}`,
    method: 'get'
  });
}

// 启用学生
export function enableStudent(data?: any) {
  return request<boolean>({
    url: `/Student/UnDelete?id=${data}`,
    method: 'get'
  });
}

// 学生设为在读
export function inStudyStudent(data?: any) {
  return request<boolean>({
    url: `/Student/InStudy?id=${data}`,
    method: 'get'
  });
}

// 学生设为结业
export function unStudyStudent(data?: any) {
  return request<boolean>({
    url: `/Student/UnStudy?id=${data}`,
    method: 'get'
  });
}

// 学生列表
export function getAllStudent(params?: Api.SystemManage.StudentSearchParams) {
  return request<SysRoleList>({
    url: `/Student/AllStudent`,
    method: 'get',
    params
  });
}
