const path = require('path')
const settings = require('./src/settings.js').cliSettings
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: settings.publicPath,
  outputDir: settings.outputDir,
  assetsDir: settings.assetsDir,
  productionSourceMap: true,
  lintOnSave: process.env.NODE_ENV !== 'production',
  devServer: {
    port: settings.port,
    progress: false,
    https: settings.https,
    disableHostCheck: true,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/': {
        target: `http://120.79.204.212:9090`,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          ['^' + '/']: ''
        }
      }
    }
  },

  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
        sassOptions: {
          fiber: require('fibers')
        }
      },
      scss: {
        prependData: `@import "~@/styles/index.scss";`
      }
    }
  },

  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },

  chainWebpack(config) {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.set('name', settings.title)
    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
    // https://webpack.js.org/configuration/devtool/#development
    config
      .when(process.env.NODE_ENV === 'development',
        (config) => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: path.resolve(__dirname, 'src/components'),
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
    if (process.env.NODE_ENV === 'production') {
      // sentry错误监控配置(自动上传sourcemap)
      config.plugin('sentry').use(SentryWebpackPlugin, [{
        ignore: ['node_modules'],
        include: `${settings.outputDir}/${settings.assetsDir}/js`, // 上传的js
        configFile: 'sentry.properties', // 配置文件地址
        release: process.env.RELEASE_VERSION, // 版本号
        urlPrefix: `~/${settings.name}/${settings.assetsDir}/js` // cdn js的代码路径前缀
      }])

      // 构建完成后自动删除sourceMap文件
      config.plugin('clean').use(CleanWebpackPlugin, [
        {
          verbose: true, // 控制台打印信息
          cleanOnceBeforeBuildPatterns: [], // 构建前不需要删除
          cleanAfterEveryBuildPatterns: [`${settings.assetsDir}/js/*.map`], // 构建完成后删除指定的文件
          protectWebpackAssets: false // 必须设置为false否则文件不会被删除
        }
      ])
    }
    // optionally replace with another progress output plugin
    // `npm i -D simple-progress-webpack-plugin` to use
    config.plugin('simple-progress-webpack-plugin').use(require.resolve('simple-progress-webpack-plugin'), [
      {
        format: 'minimal' // options are minimal, compact, expanded, verbose
      }
    ])
  }
}
