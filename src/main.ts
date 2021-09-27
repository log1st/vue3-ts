import { createApp } from 'vue';
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import { OutsideClickDirective } from '@/directives/outsideClick';

import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import { isDev, sentryDsn } from '@/utils/env';

const app = createApp(App)
  .use(store)
  .use(i18n);

app.directive('outside-click', OutsideClickDirective);

if (!isDev) {
  Sentry.init({
    logErrors: true,
    app,
    dsn: sentryDsn,
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ['localhost', window.location.origin, /^\//],
      }),
    ],
    tracesSampleRate: 1.0,
  });
}

app
  .use(router);

app.component('Var', {
  render() {
    return this.$slots.default(this.$attrs);
  },
});

app.mount('#app');
