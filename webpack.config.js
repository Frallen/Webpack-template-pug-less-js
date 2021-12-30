const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

module.exports = {
  //указываю абсолюный путь
  context: path.resolve(__dirname, "src"),
  mode: "development",
  //точка входа
  entry: "./js/index.js",
  //точка выхода
  output: {
    filename: `./js/[name].[hash].js`,
    //папка для выгрузки
    path: path.resolve(__dirname, "dist"),
    //чистака при каждой компиляции (для замены на новые файлы)
    clean: true,
    publicPath: "",
  },

  plugins: [
    require("autoprefixer"),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, "src/index.pug"),
      inject: true,
      filename: "index.html",
      minify: {
        //удаляю коменты
        removeComments: true,
        //убираю пробелы
        collapseWhitespace: isProd,
      },
    }),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, "src/step1.pug"),
      inject: true,
      chunks: ["step1"],
      filename: "step1.html",
      minify: {
        //удаляю коменты
        removeComments: true,
        //убираю пробелы
        collapseWhitespace: isProd,
      },
    }),
    new MiniCssExtractPlugin({
      filename: `./css/[name].[hash].css`,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/img"),
          to: path.resolve(__dirname, `dist/img`),
        },
        {
          from: path.resolve(__dirname, "src/fonts"),
          to: path.resolve(__dirname, "dist/fonts"),
        },
      ],
    }),
  ],
  //для определения файла и строк в chromedev
  devtool: isProd ? false : "source-map",
  module: {
    rules: [
      //компиляция babel в old js
      {
        test: /\.js$/,
        //исключаю модули
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      //для обновления html при изменениях
      { test: /\.html$/, loader: "html-loader" },
      {
        //ищу less
        test: /\.less$/i,
        //извелчение css
        use: [
          {
            //для обновления css при изменениях
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + "/";
              },
            },
          },
          "css-loader",
          "less-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.pug$/,
        loader: "pug-loader",
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.(woff(2)?|ttf|eot)$/,
        type: "asset/resource",
        generator: {
          filename: "./fonts/[name][ext]",
        },
      },
    ],
  },
  //live server
  devServer: {
    //watch dir
    static: { directory: path.join(__dirname, "dist") },
    open: true,
    compress: true,
    hot: true,
    port: 3000,
  },
};
