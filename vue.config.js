module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        // open: process.platform === 'darwin',
        // host: 'localhost',
        port: 8071,
        open: true, //配置自动启动浏览器
        proxy: {
            '/api': {
                target: 'http://localhost:4000/', //对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
}