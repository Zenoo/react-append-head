var path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/AppendHead.jsx',
    output: {
        path: path.resolve('lib'),
        filename: 'AppendHead.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            }
        ]
    }
}