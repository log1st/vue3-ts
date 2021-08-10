import Vue from 'vue'
import VueRouter from 'vue-router'
import {h} from '@vue/composition-api'

Vue.use(VueRouter)

const routes = [
  {
    path: '/sign',
    name: 'sign',
    component: () => import('@/new/components/authLayout/AuthLayout.vue'),
    redirect: {
      name: 'sign-in'
    },
    meta: {
      guest: true,
    },
    children: [
      {
        path: 'in',
        name: 'sign-in',
        component: () => import('@/new/pages/sign/in/index.vue'),
      },
      {
        path: 'up',
        name: 'sign-up',
        component: () => import('@/new/pages/sign/up/index.vue'),
      },
      {
        path: 'restore',
        name: 'sign-restore',
        component: () => import('@/new/pages/sign/restore/index.vue'),
      },
      {
        path: 'confirm',
        name: 'sign-confirm',
        component: () => import('@/new/pages/sign/confirm/index.vue'),
      },
      {
        path: 'password',
        name: 'sign-password',
        component: () => import('@/new/pages/sign/password/index.vue'),
      },
    ]
  },
  {
    path: '/',
    component: () => import('@/layouts/CabinetLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/home'),
        redirect: 'debtors',
      },
      {
        path: 'main',
        name: 'Main',
        component: () => import('../views/main/Main.vue'),
      },
      {
        path: 'companies',
        name: 'Companies',
        component: () => import('../pages/companies'),
      },
      {
        path: 'desktop',
        name: 'Desktop',
        component: () => import('../pages/desktop'),
      },
      {
        path: 'analitics',
        name: 'Analitics',
        component: () => import('../views/main/Analitics.vue'),
      },
      {
        path: 'debtors',
        name: 'debtors',
        redirect: {
          name: 'debtors-module',
          params: {
            module: 'judicial'
          }
        },
        component: () => import('@/new/pages/debtors/index.vue'),
        children: [
          {
            path: ':module',
            name: 'debtors-module',
            component: () => import('@/new/pages/debtors/_module/index.vue'),
            props: true,
          }
        ],
      },
      {
        path: 'organizations',
        name: 'organizations',
        component: () => import('@/new/pages/organizations/index.vue'),
      },
      {
        path: 'exchange',
        name: 'exchange',
        redirect: {
          name: 'exchange-import'
        },
        component: () => import('@/new/pages/exchange/index.vue'),
        children: [
          {
            path: 'import',
            name: 'exchange-import',
            component: () => import('@/new/pages/exchange/import/index.vue'),
            redirect: {
              name: 'exchange-import-instruction'
            },
            children: [
              {
                path: 'instruction',
                name: 'exchange-import-instruction',
                component: () => import('@/new/pages/exchange/instruction.vue'),
              },
              {
                path: ':type',
                name: 'exchange-import-type',
                component: () => import('@/new/pages/exchange/import/type/index.vue'),
                props: true,
              },
            ]
          },
          {
            path: 'export',
            name: 'exchange-export',
            component: () => import('@/new/pages/exchange/export/index.vue'),
          },
          {
            path: 'integration',
            name: 'exchange-integration',
            component: () => import('@/new/pages/exchange/integration/index.vue'),
          },
        ]
      },
      {
        path: 'courts',
        name: 'Courts',
        component: () => import('../views/main/Courts.vue'),
      },
      {
        path: 'documents',
        name: 'Documents',
        component: () => import('../views/main/Documents.vue'),
      },
      /*{
        path: 'panel',
        name: 'Panel',
        component: () => import('../views/main/Panel.vue'),
      },*/
      {
        path: 'panel',
        name: 'panel',
        redirect: {
          name: 'panel-constructor'
        },
        component: () => import('../new/pages/panel/index.vue'),
        children: [
          {
            path: 'constructor',
            component: () => import('../new/pages/panel/constructor/index.vue'),
            children: [
              {
                path: '',
                name: 'panel-constructor',
                component: () => import('../new/pages/panel/constructor/index/index.vue'),
                props: true,
              },
              {
                path: 'templates',
                name: 'panel-constructor-templates',
                component: () => import('../new/pages/panel/constructor/templates/index.vue'),
              },
              {
                path: 'template/:id?',
                name: 'panel-constructor-template',
                component: () => import('../new/pages/panel/constructor/template/index.vue'),
                props: true,
              },
            ]
          },
          {
            path: 'data',
            name: 'panel-data',
            component: {
              render() {
                return h('div', 'data');
              }
            }
          },
          {
            path: 'services',
            name: 'panel-services',
            component: {
              render() {
                return h('div', 'services');
              }
            }
          },
          {
            path: 'financial',
            name: 'panel-financial',
            component: {
              render() {
                return h('div', 'financial');
              }
            }
          },
        ]
      },

      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/main/Settings'),
      },
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout'),
    meta:{
      requiresAuth: true,
      adminRoute: true
    },
    redirect: {
      name: 'Admin'
    },
    children: [
      {
        path: 'editor',
        name: 'Admin',
        component: () => import('@/pages/admin/editor'),
      },
      {
        path: 'stats',
        name: 'AdminStatistic',
        component: () => import('@/pages/admin/statistic'),
      },
      {
        path: 'admin-panel',
        name: 'AdminCompany',
        component: () => import('@/pages/admin/company'),
      },
      {
        path: 'admin-settings',
        name: 'AdminSettings',
        component: () => import('@/pages/admin/settings'),
      },
    ]
  },
  {
    path: '/accruals',
    component: () => import('@/layouts/AccrualsLayout'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Accruals',
        component: () => import('../views/accruals/PageAccruals.vue'),
      },
      {
        path: 'fine',
        name: 'AccrualsFine',
        component: () => import('../views/accruals/PageAccrualsFine.vue'),
      }
    ]
  }
]
const { isNavigationFailure, NavigationFailureType } = VueRouter

export function createRouter (store) {
  const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      return next({name: 'sign'});
    }
  } else if(to.matched.some(record => record.meta.guest)) {
    if(store.getters.isLoggedIn) {
      return next({name: 'Home'})
    }
  }
  next();
})
return router
}
