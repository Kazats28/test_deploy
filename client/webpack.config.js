import path from "path";

export default {
    mode: 'development', // hoặc 'production'
    entry: './client/src/index.jsx',
    output: {
        path: path.resolve('E:\\Downloads\\Project\\dist'), // Sử dụng đường dẫn tuyệt đối trực tiếp
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Sử dụng một loader
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'] // Sử dụng style-loader và css-loader cho các tệp CSS
            }
        ]
    }
};
