const CompressionWebpackPlugin=require("compression-webpack-plugin");
// const Analyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path=require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports={
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  productionSourceMap: false,
  filenameHashing: true,
  configureWebpack: {
    name: "老黄的组件库",
    resolve: {
      alias: {
        "@": resolve("src"),
        vue$: 'vue/dist/vue.esm.js'
      }
    },
    plugins: [
      new CompressionWebpackPlugin({
        test: /\.js$|\.html$|\.css/,
        threshold: 10240, // 10K
        deleteOriginalAssets: false
      })
    ]
  },
  chainWebpack(config) {
    config.plugin("preload").tap(() => [
      {
        rel: "preload",
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: "initial"
      }
    ]);

    config.plugins.delete("prefetch");
    config
      .when(process.env.NODE_ENV!=="dev",
        config => {
          config
            .plugin("ScriptExtHtmlWebpackPlugin")
            .after("html")
            .use("script-ext-html-webpack-plugin", [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end();
          config
            .optimization.splitChunks({
              chunks: "all",
              maxInitialRequests: 5,
              cacheGroups: {
                pdf: {
                  name: "chunk-pdf",
                  priority: 35,
                  test: /[\\/]node_modules[\\/]_?(pdfjs-dist)|(vue-pdf)(.*)/
                },
                ants: {
                  name: "chunk-ant-design", // split elementUI into a single package
                  priority: 35, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?ant-design-vue(.*)/ // in order to adapt to cnpm
                },
                antDist: {
                  name: "chunk-ant-design-lib",
                  priority: 30,
                  test: /[\\/]node_modules[\\/]_?@ant-design(.*)/
                },
                // moment: {
                //   name: "chunk-moment", 
                //   priority: 25, 
                //   test: /[\\/]node_modules[\\/]_?moment(.*)/ 
                // },
                // quill: {
                //   name: "chunk-quill", 
                //   priority: 20, 
                //   test: /[\\/]node_modules[\\/]_?quill(.*)/ 
                // },
                libs: {
                  name: "chunk-libs",
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: "initial" // only package third parties that are initially dependent
                },
                views: {
                  name: "chunk-views",
                  test: resolve("src/views"), // can customize your rules
                  minChunks: 1, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                },
                // commons: {
                //   name: "chunk-commons",
                //   test: resolve("src/components"), // can customize your rules
                //   minChunks: 1, //  minimum common number
                //   priority: 5,
                //   reuseExistingChunk: true
                // }
              }
            });
          config.optimization.runtimeChunk("single");
        }
      );
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
};
