import { request } from '../request';

/** get role list */
export function getSysUserPage(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/SysUser/PageList',
    method: 'get',
    params
  });
}

// 修改用户
export function updateSysUser(data?: any) {
  return request<boolean>({
    url: '/SysUser/Update',
    method: 'post',
    data
  });
}

// 删除用户
export function addSysUser(data: any) {
  return request<boolean>({
    url: `/SysUser/Add`,
    method: 'post',
    data
  });
}

// 删除用户
export function deleteSysUser(userid?: number) {
  return request<boolean>({
    url: `/SysUser/Delete/${userid}`,
    method: 'post'
  });
}

/** get parent user list */
export function getParentList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/SysUser/PageList?RoleId=5&pageSize=100',
    method: 'get',
    params
  });
}

/** get teacher user list */
export function getTeacherList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/SysUser/PageList?RoleId=4&pageSize=100',
    method: 'get',
    params
  });
}