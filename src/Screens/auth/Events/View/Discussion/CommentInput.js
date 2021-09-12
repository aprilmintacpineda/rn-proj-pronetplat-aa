import { useRoute } from '@react-navigation/core';
import { addEvent, emitEvent } from 'fluxible-js';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
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

function mapStates ({ authUser }) {
  return { authUser };
}

function EventCommentInput () {
  const textInputRef = React.useRef(null);
  const { params: event } = useRoute();
  const { authUser } = useFluxibleStore(mapStates);
  const {
    state: { status, commentBody, replyTo, comment },
    updateState
  } = useState({
    status: 'initial',
    commentBody: '',
    replyTo: null,
    comment: null
  });

  const post = React.useCallback(async () => {
    if (!commentBody) return;

    try {
      updateState({ status: 'posting' });

      if (replyTo) {
        let reply = await xhr(
          `/event/reply-to-comment/${replyTo.id}`,
          {
            method: 'post',
            body: {
              comment: commentBody,
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
      } else if (comment) {
        await xhr(`/event/comment/${comment.id}`, {
          method: 'patch',
          body: { comment: commentBody }
        });

        showSuccessPopup({
          message: 'You comment has been updated'
        });

        if (comment.commentId) {
          emitEvent('editedReply', {
            commentId: comment.id,
            commentBody
          });
        } else {
          emitEvent('editedComment', {
            commentId: comment.id,
            commentBody
          });
        }
      } else {
        let newComment = await xhr(`/event/comment/${event.id}`, {
          method: 'post',
          body: { comment: commentBody }
        });

        newComment = await newComment.json();

        showSuccessPopup({
          message: 'Your comment was posted successfully.'
        });

        emitEvent('postedComment', newComment);
      }

      updateState({
        commentBody: '',
        comment: null,
        status: 'initial',
        replyTo: null
      });
    } catch (error) {
      console.log(error);
      unknownErrorPopup();
      updateState({ status: 'initial' });
    }
  }, [updateState, commentBody, event, replyTo, comment]);

  const onChangeText = React.useCallback(
    commentBody => {
      updateState({ commentBody });
    },
    [updateState]
  );

  const clearReplyTo = React.useCallback(() => {
    updateState({
      replyTo: null,
      commentBody: ''
    });
  }, [updateState]);

  const clearEdit = React.useCallback(() => {
    updateState({
      comment: null,
      commentBody: ''
    });
  }, [updateState]);

  React.useEffect(() => {
    const unsubscribeCallbacks = [
      addEvent('replyToComment', replyTo => {
        updateState({ replyTo });
        textInputRef.current.focus();
      }),
      addEvent('editComment', comment => {
        updateState({
          comment,
          commentBody: comment.comment
        });
      })
    ];

    return () => {
      unsubscribeCallbacks.forEach(unsubscribeCallback => {
        unsubscribeCallback();
      });
    };
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
                    {replyTo.user.id === authUser.id
                      ? 'yourself'
                      : getFullName(replyTo.user)}
                  </Text>
                </Text>
                <Caption numberOfLines={2}>
                  {replyTo.comment}
                </Caption>
              </View>
            </View>
          )}
          {comment && (
            <View
              style={{
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'flex-start'
              }}
            >
              <IconButton
                size={15}
                onPress={clearEdit}
                icon={ClearIcon}
                disabled={isPosting}
              />
              <View
                style={{ marginLeft: 10, marginRight: 25, flex: 1 }}
              >
                <Text>Editing comment</Text>
                <Caption numberOfLines={2}>
                  {comment.comment}
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
                ref={textInputRef}
                style={{
                  borderWidth: 0,
                  padding: 0,
                  margin: 0,
                  paddingBottom: Platform.OS === 'ios' ? 3 : 0,
                  opacity: isPosting ? 0.3 : 1
                }}
                textAlignVertical="top"
                value={commentBody}
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
                disabled={!commentBody}
                isLoading={isPosting}
              />
            </View>
          </View>
          <Caption style={{ marginTop: 5 }}>
            {3000 - commentBody.length} character(s) remaining
          </Caption>
        </View>
      </View>
    </View>
  );
}

export default React.memo(EventCommentInput);
