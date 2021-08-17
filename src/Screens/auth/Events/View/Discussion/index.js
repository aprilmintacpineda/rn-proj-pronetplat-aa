import React from 'react';
import { View } from 'react-native';
import CommentInput from './CommentInput';

function ViewEventDiscussion () {
  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <CommentInput />
    </View>
  );
}

export default React.memo(ViewEventDiscussion);
