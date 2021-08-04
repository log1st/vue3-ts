const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const nodeExternals = require('webpack-node-externals')
const merge = require('lodash.merge')
const { DefinePlugin } = require('webpack')
// import merge from 'lodash/merge'
const TARGET_NODE = process.env.WEBPACK_TARGET === 'node'

console.log(process.env, 'envs here')

const createApiFile = TARGET_NODE
  ? './create-api-server.js'
  : './create-api-client.js'

const target = TARGET_NODE
  ? 'server'
  : 'client'

module.exports = {
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    stats: true,
    noInfo: true,
    quiet: true,
    stats: 'errors-only',
    compress: true,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
  },
  css: {
    extract: process.env.NODE_ENV === 'production'
  },
  configureWebpack: () => ({
    entry: `./src/entry-${target}`,
    target: TARGET_NODE ? 'node' : 'web',
    node: TARGET_NODE ? undefined : false,
    plugins: [
      TARGET_NODE
        ? new VueSSRServerPlugin()
        : new VueSSRClientPlugin(),
      new DefinePlugin({
        VUE_APP_API: process.env.VUE_APP_API,
        VUE_APP_SOCKET: process.env.VUE_APP_SOCKET,
      })
    ],
    externals: TARGET_NODE ? nodeExternals({
      whitelist: /\.css$/
    }) : undefined,
    output: {
      filename: process.env.production ? 'bundle-[chunkHash].js' : 'bundle-[hash].js',
      libraryTarget: TARGET_NODE
        ? 'commonjs2'
        : undefined
    },
    optimization: {
      splitChunks: TARGET_NODE ? false : undefined
      // splitChunks: {
      //   minSize: 10000,
      //   maxSize: 250000,
      // }
    },
    resolve: {
      alias: {
        'create-api': createApiFile
      }
    }
  }),
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options =>
        merge(options, {
          optimizeSSR: false
        })
      )

    config.module.rule('svg')
      .exclude.add(/\.inline\./)

    config.module.rule('vue-svg')
      .test(/\.inline\.svg/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('svg-to-vue-component')
      .loader('svg-to-vue-component/loader')

    config.module.rule('scss')
      .oneOf('vue-modules')
      .use('css-loader')
      .tap((options) => ({
        ...options,
        modules: {
          localIdentName:
            process.env.NODE_ENV === 'development'
              ? options.modules.localIdentName
              : '[hash:base64:5]'
        }
      }))
  }
}
