import { request } from '../request/';

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
export function reqLogin(account: string, passWord: string) {
  return request<any>({
    url: '/SysLogin/Login',
    method: 'post',
    data: {
      account,
      passWord
    }
  });
}

/**
 * Chagne Password
 *
 * @param account User name
 * @param password Password
 * @param newPassword New Password
 */
export function chagnePassword(account: string, password: string, newPassword: string) {
  return request<any>({
    url: '/SysLogin/ChangePassword',
    method: 'post',
    data: {
      account,
      password,
      newPassword
    }
  });
}

/** Get user info */
export function getTokenUserInfo() {
  return request<Api.Auth.UserInfo>({ url: '/SysLogin/GetUserInfo' });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    url: 'api/auth/refreshToken',
    method: 'post',
    data: {
      refreshToken
    }
  });
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ url: '/auth/error', params: { code, msg } });
}
