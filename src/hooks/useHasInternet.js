import { useNetInfo } from '@react-native-community/netinfo';

function useHasInternet () {
  const { isConnected, isInternetReachable } = useNetInfo();
  return !(!isConnected || isInternetReachable === false);
}

export default useHasInternet;
