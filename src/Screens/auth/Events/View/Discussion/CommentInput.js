import { useRoute } from '@react-navigation/core';
import { addEvent, emitEvent } from 'fluxible-js';
import React from 'react';
import { Platform, TextInput, View } from 'react-native';
import { Text } from 'react-native-paper';
import Caption from 'components/Caption';
import IconButton from 'components/IconButton';
import RNVectorIcon from 'components/RNVectorIcon';
import {
  showSuccessPopup,
  unknownErrorPopup
} from 'fluxible/actions/popup';
import useState from 'hooks/useState';
import { getFullName } from 'libs/user';
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

function ClearIcon (props) {
  return (
    <RNVectorIcon
      provider="Ionicons"
      name="ios-close-outline"
      {...props}
    />
  );
}

function EventCommentInput () {
  const { params: event } = useRoute();
  const {
    state: { status, comment, replyTo },
    updateState
  } = useState({
    status: 'initial',
    comment: '',
    replyTo: null
  });

  const post = React.useCallback(async () => {
    if (!comment) return;

    try {
      updateState({ status: 'posting' });

      if (replyTo) {
        let reply = await xhr(
          `/event/reply-to-comment/${replyTo.id}`,
          {
            method: 'post',
            body: {
              comment,
              commentId: replyTo.id
            }
          }
        );

        reply = await reply.json();

        showSuccessPopup({
          message: 'Your reply was posted successfully.'
        });

        emitEvent('repliedToComment', {
          commentId: replyTo.id,
          reply
        });
      } else {
        let comment = await xhr(`/event/comment/${event.id}`, {
          method: 'post',
          body: { comment }
        });

        comment = await comment.json();

        showSuccessPopup({
          message: 'Your comment was posted successfully.'
        });

        emitEvent('postedComment', comment);
      }

      updateState({
        comment: '',
        status: 'initial',
        replyTo: null
      });
    } catch (error) {
      console.log(error);
      unknownErrorPopup();
      updateState({ status: 'initial' });
    }
  }, [updateState, comment, event, replyTo]);

  const onChangeText = React.useCallback(
    comment => {
      updateState({ comment });
    },
    [updateState]
  );

  const clearReplyTo = React.useCallback(() => {
    updateState({ replyTo: null });
  }, [updateState]);

  React.useEffect(() => {
    const unsubscribeCallback = addEvent(
      'replyToComment',
      replyTo => {
        updateState({ replyTo });
      }
    );

    return unsubscribeCallback;
  }, [updateState]);

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
          {replyTo && (
            <View
              style={{
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'flex-start'
              }}
            >
              <IconButton
                size={15}
                onPress={clearReplyTo}
                icon={ClearIcon}
                disabled={isPosting}
              />
              <View
                style={{ marginLeft: 10, marginRight: 25, flex: 1 }}
              >
                <Text>
                  Replying to{' '}
                  <Text style={{ fontWeight: 'bold' }}>
                    {getFullName(replyTo.user)}
                  </Text>
                </Text>
                <Caption numberOfLines={2}>
                  {replyTo.comment}
                </Caption>
              </View>
            </View>
          )}
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
                placeholder={
                  replyTo ? 'Post a reply' : 'Post a comment'
                }
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
