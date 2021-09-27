var webpack = require('webpack')
var path = require('path');
var HtmlWebpackPlugin =  require('html-webpack-plugin');

module.exports = {
    //Configuration of which file start the bundle e where the bundles will stay at end
    entry: path.resolve( __dirname, 'client', 'src', 'index.js'),
    output : {
        path : path.resolve(__dirname , 'dist'),
        filename: 'index_bundle.js'
    },
    mode:'development',

    //Modules for read all files and make the bundle
    module : {
        rules : [
            {test : /\.(scss|css)$/, use:['style-loader', 'css-loader', 'sass-loader']},
            {test : /\.(TTF|ttf)$/, use: 'file-loader'},
            {test : /\.(js|jsx)$/, use: 'babel-loader'},
            {test: /\.(svg|jpg|png)$/, use: 'url-loader'}
        ]
    },

    //Plugin for create the index.html
    plugins: [
        new HtmlWebpackPlugin ({
            template: path.resolve( __dirname, 'client', 'public', 'index.html'),
            filename: 'index.html'
        })
    ],

    //Configuration of Server
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000
    }
};
