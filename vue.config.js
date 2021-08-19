module.exports = {
  "lintOnSave": false,
  "runtimeCompiler": true,
  "filenameHashing": false,
  "productionSourceMap": false,
  // "configureWebpack": {
  //   "resolve": {
  //     "symlinks": false
  //   },
  //   "optimization": {
  //     "splitChunks": {
  //       "cacheGroups": {
  //         "app": {
  //           "chunks": "all",
  //           "name": "main",
  //           "test": {}
  //         },
  //         "defaultVendors": {
  //           "test": {},
  //           "name": "chunks"
  //         },
  //         "styles": {
  //           "name": "styles",
  //           "test": {},
  //           "chunks": "all",
  //           "minChunks": 1,
  //           "reuseExistingChunk": true,
  //           "enforce": true
  //         }
  //       }
  //     }
  //   }
  // },
  "devServer": {
    "proxy": {
      "^/api": {
        "target": process.env.NODE_ENV === 'development' ? process.env.VUE_APP_DEV : process.env.VUE_APP_PRODUCTION,
        "ws": true,
        "changeOrigin": true,
        "secure": false,
        "pathRewrite": {
          "^/api": "/api"
        },
        "logLevel": "debug"
      },
      "^/login": {
        "target": process.env.NODE_ENV === 'development' ? process.env.VUE_APP_DEV : process.env.VUE_APP_PRODUCTION,
        "ws": true,
        "changeOrigin": true,
        "secure": false,
        "pathRewrite": {
          "^/login": "/login"
        },
        "logLevel": "debug"
      }
    },
    "watchOptions": {
      "poll": true
    }

  },
}
