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
    ]
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel', 'transform-remove-console']
    }
  }
};
