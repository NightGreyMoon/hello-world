import { request } from '../request';

/** 角色分页 */
// export function getSysRolePage(params?: Api.SystemManage.RoleSearchParams) {
//   return request<Api.SystemManage.Role>({
//     url: '/SysRole/PageList',
//     method: 'get',
//     params
//   });
// }

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

// 学生列表
export function getAllStudent(params?: Api.SystemManage.StudentSearchParams) {
  return request<SysRoleList>({
    url: `/Student/AllStudent`,
    method: 'get',
    params
  });
}
