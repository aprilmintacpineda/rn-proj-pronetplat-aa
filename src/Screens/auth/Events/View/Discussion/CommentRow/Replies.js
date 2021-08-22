import React from 'react';
import { View } from 'react-native';
import CommentRow from '.';
import DataList from 'components/DataList';
import TextLink from 'components/TextLink';
import { paperTheme } from 'theme';

const eventListeners = {
  editedReply: ({ commentId, commentBody }, { replaceData }) => {
    replaceData(data =>
      data.map(comment => {
        if (comment.id !== commentId) return comment;

        return {
          ...comment,
          comment: commentBody,
          wasEdited: true
        };
      })
    );
  },
  deletedReply: (reply, { replaceData }) => {
    replaceData(data =>
      data.filter(comment => comment.id !== reply.id)
    );
  }
};

function CommentReplies ({ comment }) {
  const roundness = paperTheme.roundness * 4;
  const [isVisible, setIsVisible] = React.useState(false);

  const showReplies = React.useCallback(() => {
    setIsVisible(true);
  }, []);

  return (
    <View
      style={{
        marginLeft: roundness,
        marginTop: 10
      }}
    >
      {!isVisible ? (
        <TextLink
          textStyle={{
            color: paperTheme.colors.text,
            fontWeight: 'bold'
          }}
          onPress={showReplies}
        >
          View {comment.numReplies > 1 ? 'replies' : 'reply'}
        </TextLink>
      ) : (
        <DataList
          ItemSeparatorComponent={null}
          endpoint={`/event/replies/${comment.id}`}
          RowComponent={CommentRow}
          listEmptyMessage="There are no replies yet."
          eventListeners={eventListeners}
          ListEmptyComponent={null}
        />
      )}
    </View>
  );
}

export default React.memo(CommentReplies);
