const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: "./index",
    output: {
        path: path.join(__dirname, './dist'),
        // 文件地址，使用绝对路径形式
        filename: 'ldMap.js',
        //[name]这里是webpack提供的根据路口文件自动生成的名字
        publicPath: '/dist/'
        // 公共文件生成的地址
    },
    // 服务器配置相关，自动刷新!
    // devServer: {
    //     historyApiFallback: true,
    //     hot: false,
    //     inline: true,
    //     progress: true,
    // },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    module: {
        // avoid webpack trying to shim process
        //noParse: [/es6-promise\.js$/],
        loaders: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.js$/,
            // excluding sonpme local linked packages.
            // for normal use cases only node_modules is needed
            exclude: /node_modules/,
            loader: 'babel-loader'
        }
        , {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
                'autoprefixer-loader'
            ]
        }
        , {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=10000&name=assets/img/[name].[ext]'
            // 添加到这！并且会按照文件大小, 或者转化为 base64, 或者单独作为文件
            //在大小限制后可以加上&name=./[name].[ext]，会将我们的文件生成在设定的文件夹下。
        }, {
            test: /\.(png|jpg)$/,
            loader: 'file-loader'
        }
        ]
    }
};


if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ]
} else {
    module.exports.devtool = '#source-map'
}