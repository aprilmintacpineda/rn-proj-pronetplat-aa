import { useRoute } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import CommentInput from './CommentInput';
import CommentRow from './CommentRow';
import DataFlatList from 'components/DataFlatList';

const eventListeners = {
  commentPosted: () => {}
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
