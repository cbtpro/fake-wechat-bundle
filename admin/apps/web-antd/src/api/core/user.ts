import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  const result = await requestClient.get<any>('/admin/user/info');
  return {
    avatar: result.avatar || '',
    desc: '',
    homePath: '/dashboard/analysis',
    realName: result.nickname || result.username || '',
    roles: ['admin'],
    token: '',
    userId: String(result.id || ''),
    username: result.username || '',
  } as UserInfo;
}
