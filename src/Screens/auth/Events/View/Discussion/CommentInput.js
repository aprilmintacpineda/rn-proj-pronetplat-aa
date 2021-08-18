import { useRoute } from '@react-navigation/core';
import React from 'react';
import { Platform, TextInput, View } from 'react-native';
import Caption from 'components/Caption';
import IconButton from 'components/IconButton';
import RNVectorIcon from 'components/RNVectorIcon';
import {
  showSuccessPopup,
  unknownErrorPopup
} from 'fluxible/actions/popup';
import useState from 'hooks/useState';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

function SendIcon (props) {
  return (
    <RNVectorIcon
      provider="Ionicons"
      name="ios-arrow-undo-outline"
      {...props}
    />
  );
}

function EventCommentInput () {
  const { params: event } = useRoute();
  const {
    state: { status, comment },
    updateState
  } = useState({
    status: 'initial',
    comment: ''
  });

  const post = React.useCallback(async () => {
    if (!comment) return;

    try {
      updateState({ status: 'posting' });

      await xhr(`/event/comment/${event.id}`, {
        method: 'post',
        body: { comment }
      });

      updateState({
        comment: '',
        status: 'initial'
      });

      showSuccessPopup({
        message: 'Your comment was posted successfully.'
      });
    } catch (error) {
      console.log(error);
      unknownErrorPopup();
      updateState({ status: 'initial' });
    }
  }, [updateState, comment, event]);

  const onChangeText = React.useCallback(
    comment => {
      updateState({ comment });
    },
    [updateState]
  );

  const isPosting = status === 'posting';

  return (
    <View>
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: '#ededed'
        }}
      >
        <View style={{ padding: 10 }}>
          <View
            style={{
              flexDirection: 'row'
            }}
          >
            <View
              style={{
                flex: 1,
                padding: 10,
                backgroundColor: '#ededed',
                borderRadius: paperTheme.roundness,
                marginRight: 10,
                justifyContent: 'center'
              }}
            >
              <TextInput
                style={{
                  borderWidth: 0,
                  padding: 0,
                  margin: 0,
                  paddingBottom: Platform.OS === 'ios' ? 3 : 0,
                  opacity: isPosting ? 0.3 : 1
                }}
                textAlignVertical="top"
                value={comment}
                onChangeText={onChangeText}
                maxLength={3000}
                multiline
                placeholder="Post a comment"
                editable={!isPosting}
                focusable={!isPosting}
              />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <IconButton
                onPress={post}
                icon={SendIcon}
                disabled={!comment}
                isLoading={isPosting}
              />
            </View>
          </View>
          <Caption style={{ marginTop: 5 }}>
            {3000 - comment.length} character(s) remaining
          </Caption>
        </View>
      </View>
    </View>
  );
}

export default React.memo(EventCommentInput);
