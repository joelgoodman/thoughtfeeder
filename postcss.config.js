const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano'),
    purgecss({
      content: ['./_site/**/*.html']
    }),
    require('postcss-present-env')
  ],
};