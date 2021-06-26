import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/home'),
    redirect: 'debtors',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/main/Main.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/companies',
    name: 'Companies',
    component: () => import('../pages/companies'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/desktop',
    name: 'Desktop',
    component: () => import('../pages/desktop'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/analitics',
    name: 'Analitics',
    component: () => import('../views/main/Analitics.vue'),
    meta: {
      requiresAuth: true
    }
  },
  // {
  //   path: '/debtors',
  //   name: 'Debtors',
  //   component: () => import('../views/main/Debtors.vue'),
  //   meta: {
  //     requiresAuth: true
  //   }
  // },
  {
    path: '/debtors',
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
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/organizations',
    name: 'organizations',
    component: () => import('@/new/pages/organizations/index.vue'),
  },
  {
    path: '/exchange/manual',
    name: 'ExchangeManual',
    component: () => import('../views/main/exchange/manual'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/exchange/import',
    name: 'Import',
    component: () => import('../views/main/exchange/import'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/exchange/import/upload',
    name: 'ImportUpload',
    component: () => import('../views/main/exchange/import/upload.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/exchange/export',
    name: 'Export',
    component: () => import('../views/main/exchange/export'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/exchange/export/upload',
    name: 'ExportUpload',
    component: () => import('../views/main/exchange/export/upload'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/exchange/gis',
    name: 'Gis',
    component: () => import('../views/main/exchange/gis'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/courts',
    name: 'Courts',
    component: () => import('../views/main/Courts.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/documents',
    name: 'Documents',
    component: () => import('../views/main/Documents.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/panel',
    name: 'Panel',
    component: () => import('../views/main/Panel.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/main/Settings'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin/editor',
    name: 'Admin',
    component: () => import('@/pages/admin/editor'),
    meta:{
      layout: 'admin-layout',
      requiresAuth: true,
      adminRoute: true
    }
  },
  {
    path: '/admin/stats',
    name: 'AdminStatistic',
    component: () => import('@/pages/admin/statistic'),
    meta:{
      layout: 'admin-layout',
      requiresAuth: true,
      adminRoute: true
    }
  },
  {
    path: '/admin/admin-panel',
    name: 'AdminCompany',
    component: () => import('@/pages/admin/company'),
    meta:{
      layout: 'admin-layout',
      requiresAuth: true,
      adminRoute: true
    }
  },
  {
    path: '/admin/admin-settings',
    name: 'AdminSettings',
    component: () => import('@/pages/admin/settings'),
    meta:{
      layout: 'admin-layout',
      requiresAuth: true,
      adminRoute: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth'),
    meta: {
      layout: 'auth-layout',
      guest: true
    }
  },
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('../views/auth/Login.vue'),
  //   meta: {
  //     layout: 'auth-layout',
  //     guest: true
  //   }
  // },
  {
    path: '/accruals',
    name: 'Accruals',
    component: () => import('../views/accruals/PageAccruals.vue'),
    meta: {
      layout: 'accruals-layout',
      requiresAuth: true
    }
  },
  {
    path: '/accruals/fine',
    name: 'AccrualsFine',
    component: () => import('../views/accruals/PageAccrualsFine.vue'),
    meta: {
      layout: 'accruals-layout',
      requiresAuth: true
    }
  },
  // {
  //   path: '/accruals/lists',
  //   name: 'PagePretension',
  //   component: () => import('../views/accruals/PagePretension.vue'),
  //   // props: { params: JSON.stringify({ date: store.getters.getDebtorsDate, debtors: store.getters.debtorsChecked }) },
  //   meta: {
  //     layout: 'accruals-layout',
  //     requiresAuth: true
  //   }
  // },
  {
    path: '*',
    component: () => import('../views/auth/404.vue'),
    meta: {
      layout: 'auth-layout',
      guest: true
    }
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
    if (typeof window !== 'undefined') {
      if (store.getters.isLoggedIn) {
        next()
        return
      }
    }
    router.push('/login').catch(()=>{});
  } else {
    next()
  }
})
return router
}

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (localStorage.getItem('token') == null) {
//       next({
//         path: '/login',
//         params: { nextUrl: to.fullPath }
//       })
//     } else {
//       const user = JSON.parse(localStorage.getItem('user'))
//       if (to.matched.some(record => record.meta.is_admin)) {
//         if (user.is_admin === 1) {
//           next()
//         } else {
//           next({ name: 'userboard' })
//         }
//       } else {
//         next()
//       }
//     }
//   } else if (to.matched.some(record => record.meta.guest)) {
//     if (localStorage.getItem('jwt') == null) {
//       next()
//     } else {
//       next({ name: 'userboard' })
//     }
//   } else {
//     next()
//   }
// })

// export default router
