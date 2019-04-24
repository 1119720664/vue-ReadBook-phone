const path = require('path')
const debug = process.env.NODE_ENV !== 'production'

const bookCategoryList = require("./src/mock/bookCategoryList")
const bookFlatList = require("./src/mock/bookFlatList")
const bookHome = require("./src/mock/bookHome")
const bookList = require("./src/mock/bookList")
const bookShelf = require("./src/mock/bookShelf")


function mock(app, url, data) {
  app.get(url, (request, response) => {
    response.json(data)
  })
}


module.exports = {
  baseUrl: '/', // 根域上下文目录
  outputDir: 'dist', // 构建输出目录
  assetsDir: 'assets', // 静态资源目录 (js, css, img, fonts)
  lintOnSave: false, // 是否开启eslint保存检测，有效值：ture | false | 'error'
  runtimeCompiler: true, // 运行时版本是否需要编译
  transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
  productionSourceMap: true, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  configureWebpack: config => { // webpack配置，值位对象时会合并配置，为方法时会改写配置
    if (debug) { // 开发环境配置
      config.devtool = 'cheap-module-eval-source-map'
    } else { // 生产环境配置
    }
    Object.assign(config, { // 开发生产共同配置
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          'components': path.resolve(__dirname, './src/components'),
          'common': path.resolve(__dirname, './src/common'),
          'vue$': 'vue/dist/vue.esm.js'
        }
      }
    })
  },
  chainWebpack: config => { // webpack链接API，用于生成和修改webapck配置，https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    if (debug) {
      // 本地开发配置
    } else {
      // 生产开发配置
    }
  },
  devServer: {
    before(app) {
      mock(app, '/book/home', bookHome)
      mock(app, '/book/shelf', bookHome)
      mock(app, '/book/bookList', bookList)
      mock(app, '/book/flat-list', bookFlatList)
    }
  }
}
