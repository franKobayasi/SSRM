const path = require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    entry: {
        web:'./src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].main.js'
    },
/** module*/  
    module:{
        rules:[
            {
                test:/\.css|scss|sass$/i,
                exclude:/node_modules/,
                use:['style-loader','css-loader','sass-loader']
            },
            {
                test:/\.js$/i,
                exclude: /node_modules/,
                use:[
                {
                    loader:'babel-loader',
                    options: {
                        presets:['@babel/preset-react'],
                        plugins: ["@babel/plugin-proposal-class-properties"]
                    }
                }]
            },
            {
                test:/\.(png|jpg)$/i,
                exclude: /node_modules/,
                use:[
                {
                    loader:'file-loader',
                }]
            },
        ]
    },
/** plugins*/
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title:'React Router',
            meta:{
            viewport: 'width=device-width, initial-scale=1'
            },
            template:'./src/index.html',
            favicon: './src/img/favicon.ico',
        }),
    ],
/** webpack-dev-sever*/
    devServer: {
        contentBase: './dist'
    },
    mode:'development'
};