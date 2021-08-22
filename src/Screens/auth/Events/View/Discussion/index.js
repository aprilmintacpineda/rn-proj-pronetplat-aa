import { useRoute } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import CommentInput from './CommentInput';
import CommentRow from './CommentRow';
import DataFlatList from 'components/DataFlatList';

const eventListeners = {
  repliedToComment: ({ commentId }, { replaceData }) => {
    replaceData(data =>
      data.map(comment => {
        if (comment.id !== commentId) return comment;

        return {
          ...comment,
          numReplies: (comment.numReplies || 0) + 1
        };
      })
    );
  },
  editedComment: ({ commentId, commentBody }, { replaceData }) => {
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
  postedComment: (newComment, { replaceData }) => {
    replaceData(data => [newComment].concat(data));
  },
  deletedComment: (commentId, { replaceData }) => {
    replaceData(data =>
      data.filter(comment => comment.id !== commentId)
    );
  },
  deletedReply: (reply, { replaceData }) => {
    replaceData(data =>
      data.map(comment => {
        if (comment.id !== reply.commentId) return comment;

        return {
          ...comment,
          numReplies: comment.numReplies - 1
        };
      })
    );
  }
};

function ViewEventDiscussion () {
  const { params: event } = useRoute();

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <View style={{ flex: 1 }}>
        <DataFlatList
          ItemSeparatorComponent={null}
          endpoint={`/event/comments/${event.id}`}
          RowComponent={CommentRow}
          listEmptyMessage="There are no comments yet."
          eventListeners={eventListeners}
        />
      </View>
      <CommentInput />
    </View>
  );
}

export default React.memo(ViewEventDiscussion);
