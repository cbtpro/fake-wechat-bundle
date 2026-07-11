import { requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password: string;
    username: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
    expiresAt: number;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  const result = await requestClient.post<any>('/admin/auth/login', data);
  return {
    accessToken: result.access_token,
    expiresAt: result.expires_at,
  } as AuthApi.LoginResult;
}

/**
 * 刷新accessToken
 * 注意:后端暂未实现 refresh token,此处保留占位
 */
export async function refreshTokenApi() {
  // TODO: 后端实现后对接
  return {
    data: '',
    status: 200,
  } as AuthApi.RefreshTokenResult;
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return requestClient.post('/admin/auth/logout');
}

/**
 * 获取用户权限码
 * 注意:后端暂未实现权限码,返回空数组
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/admin/auth/codes');
}
