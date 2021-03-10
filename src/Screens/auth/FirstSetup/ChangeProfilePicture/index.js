import React from 'react';
import { ScrollView, View } from 'react-native';
import { Divider, Headline, Subheading } from 'react-native-paper';
import TriggerComponent from './TriggerComponent';
import Avatar from 'components/Avatar';
import ChangeProfilePictureWidget from 'components/ChangeProfilePictureWidget';

function ChangeProfilePicture ({ onNext, ...triggerComponentProps }) {
  return (
    <ScrollView>
      <View style={{ margin: 20 }}>
        <Headline>Setup your account</Headline>
        <Subheading>
          Add a profile picture to allow your contacts to recognize
          you easily.
        </Subheading>
        <Divider style={{ marginVertical: 20 }} />
        <View
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <Avatar label="ABC" size={150} />
        </View>
        <ChangeProfilePictureWidget
          TriggerComponent={TriggerComponent}
          triggerComponentProps={triggerComponentProps}
          onSuccess={onNext}
          firstSetup
        />
      </View>
    </ScrollView>
  );
}

export default React.memo(ChangeProfilePicture);
