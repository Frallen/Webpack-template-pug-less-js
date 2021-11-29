const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;
const filename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

module.exports = {
  //указываю абсолюный путь
  context: path.resolve(__dirname, "src"),
  mode: "development",
  //точка входа
  entry: "./js/index.js",
  //точка выхода
  output: {
    filename: `./js/${filename(`js`)}`,
    //папка для выгрузки
    path: path.resolve(__dirname, "dist"),
    //чистака при каждой компиляции (для замены на новые файлы)
    clean: true,
    publicPath: "",
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      filename: "index.html",
      minify: {
        //удаляю коменты
        removeComments: true,
        //убираю пробелы
        collapseWhitespace: isProd,
      },
    }),
    new MiniCssExtractPlugin({
      filename: `./css/${filename(`css`)}`,
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
        //ищу scss
        test: /\.s[ac]ss$/,
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
          "sass-loader",
        ],
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
