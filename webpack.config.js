const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = { //TODO config for prod
    mode: 'development',
    entry: './src/SurvivalGame.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Survival Game',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
}