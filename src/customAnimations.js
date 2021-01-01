import * as Animatable from 'react-native-animatable';

Animatable.initializeRegistryWithDefinitions({
  fadeInFromRight: {
    from: {
      opacity: 0,
      transform: [{ translateX: 50 }]
    },
    to: {
      opacity: 1,
      transform: [{ translateX: 0 }]
    }
  },
  fadeOutToRight: {
    from: {
      opacity: 1,
      transform: [{ translateX: 0 }]
    },
    to: {
      opacity: 0,
      transform: [{ translateX: 50 }]
    }
  }
});
