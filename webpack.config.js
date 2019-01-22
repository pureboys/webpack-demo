const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');

var website = {
    publicPath : 'http://localhost:1717/'
}

module.exports = {
    //入口文件的配置项
    entry: {
        entry:'./src/entry.js',
        //这里我们又引入了一个入口文件
        entry2:'./src/entry2.js'
    },
    //出口文件的配置项
    output: {
        path: path.resolve(__dirname, 'dist'), //输出的路径，用了Node语法
        filename:'[name].js',
        publicPath: website.publicPath
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
            


            // 分离css路径
            /*
            {
                test: /\.css$/, 
                use : extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                importLoaders: 1
                            }
                        },
                        'postcss-loader'
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
           */

        ]
    },
    //插件，用于生产模版和各项功能
    plugins: [
        new uglify(),
        new htmlPlugin({
            minify: {
                removeAttributeQuotes : true //却掉属性的双引号
            },
            hash: true, // 为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS
            template: './src/index.html' //是要打包的html模版路径和文件名称
        }),
        new extractTextPlugin("css/index.css")
    ],
    //配置webpack开发服务功能
    devServer : {
        //设置基本目录结构
        contentBase: path.resolve(__dirname, 'dist'),
        // 服务器的IP地址，可以使用IP也可以使用localhost
        host: 'localhost',
        //服务端压缩是否开启
        compress: true,
        //配置服务端口号
        port: 1717
    }
}