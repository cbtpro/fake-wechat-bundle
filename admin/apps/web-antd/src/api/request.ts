/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type { AxiosRequestConfig } from 'axios';
import type { RequestClientOptions } from '@vben/request';

import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  defaultResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { message } from 'ant-design-vue';
import CryptoJS from 'crypto-js';

import { useAuthStore } from '#/store';

import { refreshTokenApi } from './core';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || 'secretKey';

/** AES 加密请求数据 */
const encryptData = (data: unknown): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

/** AES 解密响应数据 */
const decryptData = (ciphertext: string): any => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

/**
 * 判断是否为需要加密的请求
 * - GET 请求不加密（无 body）
 * - FormData 不加密
 */
const shouldEncrypt = (config: AxiosRequestConfig): boolean => {
  const { method, data } = config;
  if (!data) return false;
  if (data instanceof FormData) return false;
  return method !== 'get';
};

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    baseURL,
  });

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (
      preferences.app.loginExpiredMode === 'modal' &&
      accessStore.isAccessChecked
    ) {
      accessStore.setLoginExpired(true);
    } else {
      await authStore.logout();
    }
  }

  /**
   * 刷新token逻辑
   */
  async function doRefreshToken() {
    const accessStore = useAccessStore();
    const resp = await refreshTokenApi();
    const newToken = resp.data;
    accessStore.setAccessToken(newToken);
    return newToken;
  }

  function formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null;
  }

  // 请求加密拦截器（必须在 header 拦截器之前执行）
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      if (shouldEncrypt(config)) {
        config.data = {
          ciphertext: encryptData(config.data),
        };
      }
      return config;
    },
  });

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore();

      config.headers.Authorization = formatToken(accessStore.accessToken);
      config.headers['Accept-Language'] = preferences.app.locale;
      return config;
    },
  });

  // 响应解密拦截器（在格式转换之前执行）
  client.addResponseInterceptor({
    fulfilled: (response) => {
      const { data } = response;
      if (data && data.ciphertext && typeof data.ciphertext === 'string') {
        try {
          response.data = decryptData(data.ciphertext);
        } catch {
          // 解密失败保持原样
        }
      }
      return response;
    },
  });

  // 处理返回的响应数据格式（success -> code 适配）
  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: 'success',
      dataField: 'data',
      successCode: true,
    }),
  );

  // token过期的处理
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: preferences.app.enableRefreshToken,
      formatToken,
    }),
  );

  // 通用的错误处理,如果没有进入上面的错误处理逻辑，就会进入这里
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      // 先尝试从解密后的响应体中取 message
      const responseData = error?.response?.data ?? {};
      const errorMessage = responseData?.message ?? '';
      message.error(errorMessage || msg);
    }),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL, {
  responseReturn: 'data',
});

export const baseRequestClient = new RequestClient({ baseURL: apiURL });
