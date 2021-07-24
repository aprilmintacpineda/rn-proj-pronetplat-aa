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
    'react-native-paper/babel',
    'transform-remove-console'
  );
}

plugins.push('react-native-reanimated/plugin'); // must be the last item

module.exports = {
  presets,
  plugins
};
