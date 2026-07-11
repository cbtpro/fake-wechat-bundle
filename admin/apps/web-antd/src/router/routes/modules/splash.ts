import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:square',
      order: 10,
      title: $t('page.splash.title'),
    },
    name: 'Splash',
    path: '/splash',
    children: [
      {
        name: 'SplashList',
        path: 'list',
        component: () => import('#/views/splash/list.vue'),
        meta: {
          icon: 'lucide:list',
          title: $t('page.splash.list'),
        },
      },
    ],
  },
];

export default routes;
