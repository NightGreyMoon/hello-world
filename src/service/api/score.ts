import { request } from '../request';

// 新增成绩记录
export function addScore(data?: any) {
  return request<boolean>({
    url: '/Score/Add',
    method: 'post',
    data
  });
}

// 搜索成绩记录
export function getAllScore(params?: Api.SystemManage.ScoreSearchParams) {
  return request<SysRoleList>({
    url: `/Score/All`,
    method: 'get',
    params
  });
}

// 更新成绩记录
export function updateScore(data?: any) {
  return request<boolean>({
    url: '/Score/Update',
    method: 'post',
    data
  });
}

// 作废成绩
export function disableScore(data?: any) {
  return request<boolean>({
    url: `/Score/Delete?id=${data}`,
    method: 'get'
  });
}

// 启用成绩
export function enableScore(data?: any) {
  return request<boolean>({
    url: `/Score/UnDelete?id=${data}`,
    method: 'get'
  });
}
