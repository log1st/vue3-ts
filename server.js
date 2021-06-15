/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const express = require('express')
const proxy = require('http-proxy-middleware')
const { createBundleRenderer } = require('vue-server-renderer')
const portfinder = require('portfinder')
const chalk = require('chalk')

portfinder.basePort = 8080

async function start () {
  let baseURL;
if (process.env.VUE_APP_API_URL === 'DEPLOYMENT') {
    baseURL = 'https://api.urrobot.net/';
} else {
    baseURL = 'https://apidomenpyth.ru';
}

  let availablePort
  availablePort = await portfinder.getPortPromise()

  const port = process.env.PORT || availablePort
  const devServerBaseURL = process.env.DEV_SERVER_BASE_URL || 'http://localhost'
  const devServerPort = process.env.DEV_SERVER_PORT || availablePort + 1
  const isDev = process.env.VUE_APP_API_URL === 'TESTING' || process.env.NODE_ENV === 'development' 
  

  const app = express()

  function createRenderer (bundle, options) {
    console.log(
      chalk.black.bgYellow('Started')
    )
    return createBundleRenderer(bundle, Object.assign(options, {
      runInNewContext: false
    }))
  }
  let renderer
  const templatePath = path.resolve(__dirname, './public/index.html')
  const bundle = require('./dist/vue-ssr-server-bundle.json')
  const template = fs.readFileSync(templatePath, 'utf-8')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  console.log(
    chalk.black.bgRed(`\n ${process.env.NODE_ENV} `),
    chalk.black.bgGreen(`\n ${baseURL} `),
    chalk.black.bgMagenta(`\n Prepare to start \n`)
  )
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  })
 

  if (isDev) {
    // Проксировать все js файлы, например при разделения на чанки
    // при ленивой загрузки
    
    app.use('/*.js', proxy({
      target: `${devServerBaseURL}:${devServerPort}`,
      changeOrigin: true,
      pathRewrite: function (path) {
        return path.includes('main')
          ? '/main.js'
          : path
      },
      prependPath: false
    }))
    
    app.use('/*hot-update*', proxy({
      target: `${devServerBaseURL}:${devServerPort}`,
      changeOrigin: true
    }))

    app.use('/sockjs-node', proxy({
      target: `${devServerBaseURL}:${devServerPort}`,
      changeOrigin: true,
      ws: true
    }))
  }
  
  // Статика
  app.use('/js', express.static(path.resolve(__dirname, './dist/js')))
  app.use('/img', express.static(path.resolve(__dirname, './dist/img')))
  app.use('/css', express.static(path.resolve(__dirname, './dist/css')))
  app.use('/manifest.json', express.static(path.resolve(__dirname, './dist/manifest.json')))
  app.use('/robots.txt', express.static(path.resolve(__dirname, './dist/robots.txt')))

  app.get('*', (req, res) => {
    res.setHeader('Content-Type', 'text/html') 
    
    
    const context = {
      title: 'App | ',
      url: req.url
    }
    

    renderer.renderToString(context, (err, html) => {
      if (err) {
        if (err.url) {
          res.redirect(err.url)
        } else {
          res.status(500).end('500 | Internal Server Error')
          console.error(`error during render : ${req.url}`)
          console.error(err.stack)
        }
      }
      res.status(context.HTTPStatus || 200)
      res.send(html)
    })
  })

  app.listen(port, () => {
    console.log(
      chalk.black.bgGreen('\n DONE \n'),
      chalk.black.bgRed('\n Test Version urrobot-front v2.0.0 \n'),
      chalk.green(`\nServer started at ${chalk.cyan(`http://localhost:${port}`)} \n`) 
    )
  })
}

start()
