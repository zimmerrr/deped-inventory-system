import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/index.vue'),
        meta: { showHeader: true },
      },
      {
        path: 'inventory',
        component: () => import('pages/inventory.vue'),
        meta: { showHeader: true },
      },
      {
        path: 'login',
        component: () => import('pages/login.vue'),
      },
      {
        path: 'logout',
        component: () => import('pages/logout.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      {
        path: 'users',
        component: () => import('pages/admin/users.vue'),
        meta: { showHeader: true },
      },
      {
        path: 'items',
        component: () => import('pages/admin/items.vue'),
        meta: { showHeader: true },
      },
      {
        path: 'logs',
        component: () => import('pages/admin/logs.vue'),
        meta: { showHeader: true },

      },
      {
        path: 'logout',
        component: () => import('pages/logout.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
