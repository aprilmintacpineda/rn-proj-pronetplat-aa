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
  },
  fadeInFromBottom: {
    from: {
      opacity: 0,
      transform: [{ translateY: 50 }]
    },
    to: {
      opacity: 1,
      transform: [{ translateY: 0 }]
    }
  },
  fadeOutToBottom: {
    from: {
      opacity: 1,
      transform: [{ translateY: 0 }]
    },
    to: {
      opacity: 0,
      transform: [{ translateY: 50 }]
    }
  }
});
