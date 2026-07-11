import { requestClient } from '#/api/request';

export enum SplashType {
  SPLASH = 'SPLASH',
  AD = 'AD',
}

export enum SplashStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum SplashTheme {
  ALL = 'ALL',
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export interface ISplashConfig {
  id: number;
  type: SplashType;
  title: string;
  content: string;
  imageUrl: string;
  linkUrl: string;
  duration: number;
  sortOrder: number;
  status: SplashStatus;
  theme: SplashTheme;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISplashListResult {
  items: ISplashConfig[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ICreateSplashConfigDto {
  type: SplashType;
  title: string;
  content?: string;
  imageUrl?: string;
  linkUrl?: string;
  duration?: number;
  sortOrder?: number;
  status?: SplashStatus;
  theme?: SplashTheme;
  startTime?: Date;
  endTime?: Date;
}

export interface IUpdateSplashConfigDto {
  type?: SplashType;
  title?: string;
  content?: string;
  imageUrl?: string;
  linkUrl?: string;
  duration?: number;
  sortOrder?: number;
  status?: SplashStatus;
  theme?: SplashTheme;
  startTime?: Date;
  endTime?: Date;
}

export async function getSplashListApi(
  params?: Partial<{
    type: SplashType;
    status: SplashStatus;
    theme: SplashTheme;
    page: number;
    pageSize: number;
  }>,
): Promise<ISplashListResult> {
  return requestClient.get('/admin/splash/list', { params });
}

export async function getSplashByIdApi(id: number): Promise<ISplashConfig> {
  return requestClient.get(`/admin/splash/${id}`);
}

export async function getActiveSplashApi(
  type?: SplashType,
  theme?: SplashTheme,
): Promise<ISplashConfig[]> {
  const params: Record<string, any> = {};
  if (type) params.type = type;
  if (theme) params.theme = theme;
  return requestClient.get('/admin/splash/active', { params });
}

export async function createSplashApi(data: ICreateSplashConfigDto): Promise<ISplashConfig> {
  return requestClient.post('/admin/splash/create', data);
}

export async function updateSplashApi(id: number, data: IUpdateSplashConfigDto): Promise<ISplashConfig> {
  return requestClient.put(`/admin/splash/${id}`, data);
}

export async function deleteSplashApi(id: number): Promise<void> {
  return requestClient.delete(`/admin/splash/${id}`);
}
