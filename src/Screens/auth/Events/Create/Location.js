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
import { paperTheme } from 'theme';

const maxZoomLevel = Platform.select({ ios: 16, android: 18 });

function Location () {
  const mapViewRef = React.useRef();
  const { width } = useWindowDimensions();
  const {
    formValues: { location },
    setField,
    disabled,
    formErrors
  } = React.useContext(FormContext);

  const openModal = React.useCallback(async () => {
    try {
      StatusBar.setHidden(true);
      const selected = await RNGooglePlaces.openAutocompleteModal();
      setField('location', selected);
    } catch (error) {
      console.log(error);
    } finally {
      StatusBar.setHidden(false);
    }
  }, [setField]);

  React.useEffect(() => {
    if (location)
      mapViewRef.current.fitToCoordinates([location.location], true);
  }, [location]);

  return (
    <View style={{ marginTop: 15, marginBottom: 15 }}>
      <TextInput
        label="Location"
        editable={false}
        value={location?.address || ''}
        error={formErrors.location}
        onPress={openModal}
        disabled={disabled}
        multiline
      />
      <MapView
        style={{
          width: width - 20,
          height: 300,
          marginTop: 10,
          borderWidth: 1,
          borderColor: paperTheme.colors.backdrop
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
