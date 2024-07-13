import { request } from '../request';

/** 角色分页 */
export function getSysData(params?: any) {
  return request<SystemInfo>({
    url: '/SysData/GetSystemInfo',
    method: 'get',
    params
  });
}

export function getHomeData() {
  return request<SystemInfo>({
    url: '/Home/Dashboard',
    method: 'get'
  });
}
