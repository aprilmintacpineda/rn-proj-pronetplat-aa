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
    'optional-require'
  ],
  env: {
    production: {
      plugins: [
        'react-native-paper/babel',
        'transform-remove-console',
        [
          'babel-plugin-transform-strip-block',
          {
            requireDirective: false,
            identifiers: [
              { start: 'devOnly:start', end: 'devOnly:end' }
            ]
          }
        ]
      ]
    }
  }
};
