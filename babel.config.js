const alias = require('./importAliases');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias
      }
    ],
    'optional-require',
    [
      'search-and-replace',
      {
        rules: [
          {
            search: /__STAGE__/gm,
            replace: process.env.STAGE
          },
          {
            search: /__API_BASE_URL__/gm,
            replace: process.env.API_BASE_URL
          }
        ]
      }
    ]
  ],
  env: {
    production: {
      plugins: [
        'react-native-paper/babel',
        'transform-remove-console'
      ]
    }
  }
};
