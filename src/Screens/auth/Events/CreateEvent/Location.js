import React from 'react';
import {
  Platform,
  StatusBar,
  useWindowDimensions,
  View
} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import MapView, { Marker } from 'react-native-maps';
import { FormContext } from 'components/FormWithContext';
import TextInput from 'components/TextInput';

const maxZoomLevel = Platform.select({ ios: 16, android: 18 });

function Location () {
  const mapViewRef = React.useRef();
  const { width } = useWindowDimensions();
  const { formValues, setField, disabled } =
    React.useContext(FormContext);
  const { location } = formValues;

  const openModal = React.useCallback(async () => {
    try {
      StatusBar.setHidden(true);
      const selected = await RNGooglePlaces.openAutocompleteModal();

      mapViewRef.current.fitToCoordinates([selected.location], true);

      setField('location', selected);
    } catch (error) {
      console.log(error);
    } finally {
      StatusBar.setHidden(false);
    }
  }, [setField]);

  return (
    <View style={{ marginTop: 15, marginBottom: 15 }}>
      <TextInput
        label="Location"
        editable={false}
        value={location?.address || ''}
        onPress={openModal}
        disabled={disabled}
        multiline
      />
      <MapView
        style={{
          width: width - 20,
          height: 300,
          marginTop: 10
        }}
        rotateEnabled={false}
        ref={mapViewRef}
        maxZoomLevel={maxZoomLevel}
      >
        {location ? (
          <Marker identifier="main" coordinate={location.location} />
        ) : null}
      </MapView>
    </View>
  );
}

export default React.memo(Location);
