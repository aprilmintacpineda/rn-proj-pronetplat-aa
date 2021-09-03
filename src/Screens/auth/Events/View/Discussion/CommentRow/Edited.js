import React from 'react';
import EditHistoryRow from './EditHistoryRow';
import DataFlatList from 'components/DataFlatList';
import DotSeparator from 'components/DotSeparator';
import Modalize from 'components/Modalize';
import TextLink from 'components/TextLink';

function CommentEdited ({ comment }) {
  const historyModalizeRef = React.useRef();
  const isReply = Boolean(comment.commentId);

  const showEditHistory = React.useCallback(() => {
    historyModalizeRef.current.open();
  }, []);

  return (
    <>
      <TextLink onPress={showEditHistory}>Edited</TextLink>
      {!isReply && <DotSeparator />}
      <Modalize ref={historyModalizeRef} customRenderer>
        <DataFlatList
          endpoint={`/event/comment/edit-history/${comment.id}`}
          RowComponent={EditHistoryRow}
          listEmptyMessage="There are no edits yet"
        />
      </Modalize>
    </>
  );
}

export default React.memo(CommentEdited);
