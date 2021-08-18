import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Caption from 'components/Caption';
import DotSeparator from 'components/DotSeparator';
import TextLink from 'components/TextLink';
import TimeAgo from 'components/TimeAgo';
import UserAvatar from 'components/UserAvatar';
import { renderLinks } from 'libs/strings';
import { getFullName } from 'libs/user';
import { paperTheme } from 'theme';

function CommentRow ({ comment, numReplies, createdAt, user }) {
  const body = React.useMemo(() => renderLinks(comment), [comment]);
  const roundness = paperTheme.roundness * 4;

  return (
    <View
      style={{ display: 'flex', flexDirection: 'row', padding: 10 }}
    >
      <UserAvatar user={user} size={40} />
      <View style={{ marginLeft: 10 }}>
        <View
          style={{
            backgroundColor: '#e6e6e6',
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: roundness
          }}
        >
          <Text style={{ fontWeight: 'bold' }} numberOfLines={1}>
            {getFullName(user)}
          </Text>
          <Text>{body}</Text>
          <Caption style={{ marginTop: 5 }}>
            <TimeAgo dateFrom={createdAt} />
          </Caption>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: roundness,
            marginTop: 10
          }}
        >
          <TextLink>Reply</TextLink>
          {numReplies && (
            <>
              <DotSeparator />
              <Text style={{ color: 'gray' }}>3 replies</Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

export default React.memo(CommentRow);
