import { createRouter, createWebHistory } from 'vue-router';
import { h } from 'vue';
import store from '@/store';
import { AuthGuardResponse } from '@/store/modules/user';
import { IDialog } from '@/hooks/useDialog';
import { DataTypeKey } from '@/hooks/useExchange';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/sign',
      name: 'sign',
      redirect: {
        name: 'sign-in',
      },
      meta: {
        guestRequired: true,
      },
      component: () => import(/* webpackChunkName: "sign" */ '@/components/authLayout/AuthLayout.vue'),
      children: [
        {
          path: 'in',
          name: 'sign-in',
          component: () => import(/* webpackChunkName: "sign" */ '@/pages/sign/in/index.vue'),
        },
        {
          path: 'up',
          name: 'sign-up',
          component: () => import(/* webpackChunkName: "sign" */ '@/pages/sign/up/index.vue'),
        },
        {
          path: 'forgot',
          name: 'sign-forgot',
          component: () => import(/* webpackChunkName: "sign" */ '@/pages/sign/forgot/index.vue'),
        },
        {
          path: 'confirm',
          name: 'sign-confirm',
          component: () => import(/* webpackChunkName: "sign" */ '@/pages/sign/confirm/index.vue'),
        },
        {
          path: 'password',
          name: 'sign-password',
          component: () => import(/* webpackChunkName: "sign" */ '@/pages/sign/password/index.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "main" */ '@/components/mainLayout/MainLayout.vue'),
      meta: {
        authRequired: true,
      },
      children: [
        {
          name: 'index',
          path: '',
          redirect: {
            name: 'debtors',
          },
        },
        {
          name: 'organizations',
          path: 'organizations',
          component: () => import(/* webpackChunkName: "organizations" */ '@/pages/organizations/index.vue'),
        },
        {
          name: 'debtors',
          path: 'debtors',
          component: {
            render() {
              return h('div');
            },
          },
        },
        {
          name: 'debtors',
          path: 'debtors',
          redirect: {
            name: 'debtors-module',
            params: {
              module: DataTypeKey.judicial,
            },
          },
          component: () => import(/* webpackChunkName: "debtors" */ '@/pages/debtors/index.vue'),
          children: [
            {
              name: 'debtors-module',
              path: ':module?',
              props: true,
              component: () => import(/* webpackChunkName: "debtors" */ '@/pages/debtors/_module/index.vue'),
            },
          ],
        },
        {
          name: 'exchange',
          path: 'exchange',
          redirect: {
            name: 'exchange-import',
          },
          component: () => import(/* webpackChunkName: "exchange" */ '@/pages/exchange/index.vue'),
          children: [
            {
              name: 'exchange-import',
              path: 'import/:dataType?',
              component: () => import(/* webpackChunkName: "exchange" */ '@/pages/exchange/import/index.vue'),
              props: true,
            },
            {
              name: 'exchange-export',
              path: 'export/:dataType?',
              component: () => import(/* webpackChunkName: "exchange" */ '@/pages/exchange/export/index.vue'),
              props: true,
            },
            {
              name: 'exchange-integration',
              path: 'integration/:dataType?',
              component: () => import(/* webpackChunkName: "exchange" */ '@/pages/exchange/integration/index.vue'),
              props: true,
            },
          ],
        },
        {
          name: 'panel',
          path: 'panel',
          redirect: {
            name: 'panel-index',
          },
          component: () => import(/* webpackChunkName: "panel" */ '@/pages/panel/index.vue'),
          children: [
            {
              path: '',
              name: 'panel-index',
              component: () => import(/* webpackChunkName: "panel" */ '@/pages/panel/index/index.vue'),
            },
            {
              path: 'tariffs',
              name: 'panel-tariffs',
              component: () => import(/* webpackChunkName: "panel" */ '@/pages/panel/tariffs/index.vue'),
            },
            {
              path: 'finances',
              name: 'panel-finances',
              component: () => import(/* webpackChunkName: "panel" */ '@/pages/panel/finances/index.vue'),
            },
            {
              path: 'constructor',
              component: () => import(/* webpackChunkName: "panel" */ '@/pages/panel/constructor/index.vue'),
              children: [
                {
                  path: '',
                  name: 'panel-constructor',
                  component: () => import(/* webpackChunkName: "panel" */ '@/pages/panel/constructor/index/index.vue'),
                },
                {
                  path: 'template/:id?',
                  name: 'panel-constructor-template',
                  component: () => import(/* webpackChunkName: "panel" */ '@/pages/panel/constructor/template/index.vue'),
                  props: true,
                },
                {
                  path: 'templates',
                  name: 'panel-constructor-templates',
                  component: () => import(/* webpackChunkName: "panel" */ '@/pages/panel/constructor/templates/index.vue'),
                },
              ],
            },
            {
              path: 'password',
              name: 'panel-password',
              component: () => import(/* webpackChunkName: "panel" */ '@/pages/panel/password/index.vue'),
            },
          ],
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const response = await store.dispatch(
    'user/checkAuth',
    {
      isAuthorized: store.getters['user/isAuthorized'],
      ...to.meta,
    },
  ) as AuthGuardResponse;
  if (response.result) {
    next();
    return;
  }
  next(response.redirect);
});

router.beforeEach(async (to, from, next) => {
  try {
    const dialog = JSON.parse(to.hash.substr(1)) as IDialog | undefined;
    if (
      dialog
      && 'component' in dialog
    ) {
      if (
        store.getters['layout/dialogs'][store.getters['layout/dialogs'].length - 1]?.component
        !== dialog.component
      ) {
        await store.dispatch('layout/showDialog', {
          component: dialog.component,
          payload: dialog.payload || {},
          addInRoute: false,
        } as IDialog);
      }
    }
  } catch (e) {
    //
  }
  next();
});

export default router;
