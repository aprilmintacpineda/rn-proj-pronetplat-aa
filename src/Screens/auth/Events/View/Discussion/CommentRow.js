import { emitEvent } from 'fluxible-js';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import EditHistoryRow from './EditHistoryRow';
import Button from 'components/Button';
import Caption from 'components/Caption';
import DataFlatList from 'components/DataFlatList';
import DotSeparator from 'components/DotSeparator';
import Modalize from 'components/Modalize';
import TextLink from 'components/TextLink';
import TimeAgo from 'components/TimeAgo';
import TouchableRipple from 'components/TouchableRipple';
import UserAvatar from 'components/UserAvatar';
import {
  showSuccessPopup,
  unknownErrorPopup
} from 'fluxible/actions/popup';
import { renderLinks } from 'libs/strings';
import { getFullName } from 'libs/user';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

function mapStates ({ authUser }) {
  return { authUser };
}

function CommentRow (comment) {
  const { authUser } = useFluxibleStore(mapStates);
  const {
    comment: _comment,
    numReplies,
    createdAt,
    user,
    wasEdited
  } = comment;
  const roundness = paperTheme.roundness * 4;
  const actionsModalizeRef = React.useRef();
  const historyModalizeRef = React.useRef();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const body = React.useMemo(
    () => renderLinks(_comment),
    [_comment]
  );

  const reply = React.useCallback(() => {
    emitEvent('replyToComment', comment);
  }, [comment]);

  const onPress = React.useCallback(() => {
    actionsModalizeRef.current.open();
  }, []);

  const deleteComment = React.useCallback(async () => {
    try {
      setIsDeleting(true);

      await xhr(`/event/comment/${comment.id}`, {
        method: 'delete'
      });

      showSuccessPopup({
        message: 'Your comment has been deleted.'
      });

      emitEvent('deletedComment', comment.id);
    } catch (error) {
      console.log(error);
      unknownErrorPopup();
      setIsDeleting(false);
    }
  }, [comment]);

  const editComment = React.useCallback(() => {
    emitEvent('editComment', comment);
    actionsModalizeRef.current.close();
  }, [comment]);

  const showEditHistory = React.useCallback(() => {
    historyModalizeRef.current.open();
  }, []);

  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: 10
        }}
      >
        <UserAvatar user={user} size={40} />
        <View style={{ marginLeft: 10 }}>
          <View
            style={{
              backgroundColor: '#e6e6e6',
              borderRadius: roundness,
              overflow: 'hidden'
            }}
          >
            <TouchableRipple
              onPress={onPress}
              disabled={user.id !== authUser.id}
            >
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15
                }}
              >
                <Text
                  style={{ fontWeight: 'bold' }}
                  numberOfLines={1}
                >
                  {getFullName(user)}
                </Text>
                <Text>{body}</Text>
                <Caption style={{ marginTop: 5 }}>
                  <TimeAgo dateFrom={createdAt} />
                </Caption>
              </View>
            </TouchableRipple>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: roundness,
              marginTop: 10,
              alignItems: 'center'
            }}
          >
            {wasEdited && (
              <>
                <TextLink onPress={showEditHistory}>Edited</TextLink>
                <DotSeparator />
              </>
            )}
            <TextLink onPress={reply}>Reply</TextLink>
            {numReplies && (
              <>
                <DotSeparator />
                <Text style={{ color: 'gray' }}>
                  {Number(numReplies).toLocaleString()}{' '}
                  {numReplies > 1 ? 'replies' : 'reply'}
                </Text>
              </>
            )}
          </View>
          {numReplies && (
            <View
              style={{
                marginLeft: roundness,
                marginTop: 10
              }}
            >
              <TextLink
                textStyle={{
                  color: paperTheme.colors.text,
                  fontWeight: 'bold'
                }}
              >
                View replies
              </TextLink>
            </View>
          )}
        </View>
      </View>
      <Modalize ref={actionsModalizeRef}>
        <Button
          mode="contained"
          style={{ marginBottom: 10 }}
          disabled={isDeleting}
          onPress={editComment}
        >
          Edit
        </Button>
        <Button
          mode="outlined"
          color={paperTheme.colors.error}
          onPress={deleteComment}
          loading={isDeleting}
        >
          Delete
        </Button>
      </Modalize>
      <Modalize
        ref={historyModalizeRef}
        unmountOnClose
        customRenderer
      >
        <DataFlatList
          endpoint={`/event/comment/edit-history/${comment.id}`}
          RowComponent={EditHistoryRow}
          listEmptyMessage="There are no edits yet"
        />
      </Modalize>
    </>
  );
}

export default React.memo(CommentRow);
