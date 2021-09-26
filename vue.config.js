const title = require('./package.json').description;

module.exports = {
  devServer: {
    proxy: {
      '/(api|media)': {
        target: process.env.VUE_APP_LOCAL_API_URL,
        pathRewrite: {
          '^/api/': '/',
        },
        logLevel: 'debug',
      },
      '/ws': {
        target: process.env.VUE_APP_LOCAL_WS_URL,
        pathRewrite: {
          '^/ws/': '/',
        },
        logLevel: 'debug',
        ws: true,
      },
    },
  },
  chainWebpack(config) {
    config.module.rule('csv')
      .test(/\.(csv|xls|xlsx)$/)
      .use('file-loader')
      .loader('file-loader');

    config.module.rule('svg')
      .exclude.add(/\.inline\./);

    config.module.rule('vue-svg')
      .test(/\.inline\.svg/)
      .use('vue-loader')
      .loader('vue-loader-v16')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .options({
        svgo: false,
      });

    config.module.rule('scss')
      .oneOf('vue-modules')
      .use('css-loader')
      .tap((options) => ({
        ...options,
        modules: {
          localIdentName:
            process.env.NODE_ENV === 'development'
              ? '[local]_[hash:base64:5]'
              : '[hash:base64:5]',
        },
      }));

    config.plugin('html').tap((args) => ([
      { ...args[0], title },
      ...args.slice(1),
    ]));

    return config;
  },
  pwa: {
    themeColor: '#130f40',
    msTileColor: '#130f40',
    name: require('./package.json').description,
    manifestOptions: {
      icons: [
        {
          src: './img/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: './img/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: './img/icons/android-chrome-maskable-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: './img/icons/android-chrome-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: './img/icons/apple-touch-icon-60x60.png',
          sizes: '60x60',
          type: 'image/png',
        },
        {
          src: './img/icons/apple-touch-icon-76x76.png',
          sizes: '76x76',
          type: 'image/png',
        },
        {
          src: './img/icons/apple-touch-icon-120x120.png',
          sizes: '120x120',
          type: 'image/png',
        },
        {
          src: './img/icons/apple-touch-icon-152x152.png',
          sizes: '152x152',
          type: 'image/png',
        },
        {
          src: './img/icons/apple-touch-icon-180x180.png',
          sizes: '180x180',
          type: 'image/png',
        },
        {
          src: './img/icons/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png',
        },
        {
          src: './img/icons/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          src: './img/icons/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          src: './img/icons/msapplication-icon-144x144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: './img/icons/mstile-150x150.png',
          sizes: '150x150',
          type: 'image/png',
        },
      ],
    },
  },

};
