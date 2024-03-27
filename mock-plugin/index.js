const url = require('url')
const path = require('path')
const chokidar = require('chokidar')
const glob = require('glob')
const Router = require('routes')
const bodyParser = require('body-parser')

class MockMiddleware {
  constructor(mockPath) {
    this.mockPath = mockPath
    console.log(`Load mocks from ${mockPath}`)
    this.createRouter()
    this.setupWatcher()
  }

  createRouter() {
    const router = new Router()

    glob.sync(`${this.mockPath}/**/*.js`).forEach((file) => {
      const routes = require(path.resolve(file))
      Object.keys(routes).forEach((path) => {
        router.addRoute(path, routes[path])
      })
    })

    this.router = router
  }

  setupWatcher() {
    const watcher = chokidar.watch(this.mockPath, {
      ignoreInitial: true,
    })

    const basename = path.basename(this.mockPath)
    const ptrn = new RegExp(`[/\\\\]${basename}[/\\\\]`)
    watcher.on('all', () => {
      console.log('Reload mocks.')
      Object.keys(require.cache)
        .filter((id) => ptrn.test(id))
        .forEach((id) => {
          delete require.cache[id]
        })
      this.createRouter()
    })
  }

  middleware = (req, res, next) => {
    const { pathname } = url.parse(req.url)
    const m = this.router.match(req.method + ' ' + pathname)
    if (m) {
      m.fn(req, res, m.params)
    } else {
      next()
    }
  }
}

const mockPlugin = () => ({
  name: 'mock-plugin',
  configureServer(server) {
    server.middlewares.use(bodyParser.json())

    const { middleware } = new MockMiddleware('./mock')
    server.middlewares.use(middleware)
  },
})

module.exports = {
  mockPlugin,
}
