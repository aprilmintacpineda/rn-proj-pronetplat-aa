const alias = require('./importAliases');

const presets = ['module:metro-react-native-babel-preset'];

const plugins = [
  'optional-require',
  [
    'module-resolver',
    {
      root: ['./src'],
      alias
    }
  ]
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    'react-native-paper/babel', // react-native-paper
    'transform-remove-console',
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
          },
          {
            search: /__WEBSOCKET_URL__/gm,
            replace: process.env.WEBSOCKET_URL
          }
        ]
      }
    ]
  );
}

plugins.push('react-native-reanimated/plugin'); // must be the last item

module.exports = {
  presets,
  plugins
};
