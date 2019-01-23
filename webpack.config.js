const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const glob = require('glob')
const PurifyCSSPlugin = require('purifycss-webpack')
const entry = require('./webpack_config/entry_webpack.js')
const webpack = require('webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');

if (process.env.type == 'build')
{
    var website = {
        publicPath : 'http://localhost',
        port: '1717',
        host: 'localhost'
    }
}
else
{
    var website = {
        publicPath : 'http://webpack.demo.com',
        port: '1717',
        host: 'webpack.demo.com'
    }
}



module.exports = {
    devtool: 'eval-source-map',
    //入口文件的配置项
    entry: entry.path,
    //出口文件的配置项
    output: {
        path: path.resolve(__dirname, 'dist'), //输出的路径，用了Node语法
        filename:'[name].js',
        publicPath: website.publicPath + ':' + website.port + '/'
    },
    //模块：例如解读CSS,图片如何转换，压缩
    module : {
        rules: [

            {
                test: /\.(png|jpg|gif)/,
                use : [
                    {
                        loader: 'url-loader',
                        options: {
                            limit : 5, // 是把小于500000B的文件打成Base64的格式，写入JS。
                            outputPath: 'images/' // 图片打包到images
                        }
                    }
                ]
            },

            {
                test: /\.(htm|html)$/i,
                use : ['html-withimg-loader']
            },

            {
                test: /\.(jsx|js)$/,
                use : {
                    loader: 'babel-loader'
                },
                exclude: /node_modules/
            },


            /*
            // 不分离 css 部分
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                           modules: false,
                           importLoaders: 1
                        }
                    }
                    ,
                    {
                        loader: "postcss-loader"
                    }
                ]
            },

            {
                test: /.\less$/,
                use: [
                    // 不分离 less
                    {
                        loader: "style-loader"
                    },
                    {
                        loader : "css-loader"
                    },
                    {
                        loader: "less-loader"
                    }
                ]
            },
            
            {
                test: /\.scss$/,
                use: [
                    // 不分离 scss
                    {
                        loader : "style-loader"
                    },
                    {
                        loader : "css-loader"
                    },
                    {
                        loader : "sass-loader"
                    }
                ]
            }
            */


            // 分离css路径
            
            {
                test: /\.css$/, 
                use : extractTextPlugin.extract({
                    fallback: "style-loader", // 用来处理css文件中的url()等
                    use: [
                        {
                            loader: "css-loader", // 它是用来将css插入到页面的style标签
                            options: {
                                importLoaders: 1
                            }
                        },
                        'postcss-loader' // 给css加上浏览器加上前缀
                    ]
                })
            },
            
           
           {
                test: /.\less$/,
                // 分离 less, 会加到css中
                use: extractTextPlugin.extract({
                    use: [
                        {
                            loader : "css-loader"
                        },
                        {
                            loader: "less-loader"
                        }
                    ],
                    fallback: "style-loader"
                })
            },
           
           
           {
                test: /\.scss$/,
                // 分离 sass, 会加到css中
                use: extractTextPlugin.extract({
                    use: [
                        {
                            loader: "css-loader"
                        }, 
                        {
                            loader: "sass-loader"
                        }
                    ],
                    fallback: "style-loader"
                })
           }
           

        ]
    },
    //插件，用于生产模版和各项功能
    plugins: [
       // new uglify(), // 压缩JS代码
        new htmlPlugin({
            minify: {
                removeAttributeQuotes : true //却掉属性的双引号
            },
            chunks: ["vue", "jquery","entry2", "entry"],
            chunksSortMode : "manual",
            hash: true, // 为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS
            template: './src/index.html' //是要打包的html模版路径和文件名称
        }),
        new extractTextPlugin("css/index.css"), // 把css分离出来
        new PurifyCSSPlugin({ // 删除没有用到的css
            paths: glob.sync(path.join(__dirname, 'src/*.html'))
        }),
        // new webpack.ProvidePlugin({ // 引入jquery包, 引用后只有在类库使用时，才按需进行打包
        //     $: "jquery"
        // }),
        new webpack.BannerPlugin('oliver所有!!!'), // css js 增加版权
        new webpack.optimize.CommonsChunkPlugin({
            //name对应入口文件中的名字，我们起的是jQuery
            name: ["jquery", "vue"],
            //把文件打包到哪里，是一个路径
            filename: "assets/js/[name].min.js",
            //最小打包的文件模块数，这里直接写2就好
            minChunks:2
        }),
        new copyWebpackPlugin([{ // 打包静态文件
            from: __dirname + '/src/public',
            to : './publuc'
        }]),
        new webpack.HotModuleReplacementPlugin(), //热加载, 更新文件刷新页面
    ],
    //配置webpack开发服务功能
    devServer : {
        //设置基本目录结构
        contentBase: path.resolve(__dirname, 'dist'),
        // 服务器的IP地址，可以使用IP也可以使用localhost
        host: website.host,
        //服务端压缩是否开启
        compress: true,
        //配置服务端口号
        port: website.port
    },
    watchOptions : {
        poll: 1000, //检测修改的时间，以毫秒为单位
        aggregateTimeout: 500, //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
        ignored: /node_modules/,  //不监听的目录
    }
}