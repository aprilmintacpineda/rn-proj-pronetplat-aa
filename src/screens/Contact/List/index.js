import React from 'react';
import { FlatList } from 'react-native';

import ListItemSeparator from 'components/ListItemSeparator';

import ContactListEmpty from './Empty';
import ContactListRow from './Row';

const data = [
  {
    id: '1',
    firstName: 'Test',
    middleName: 'user',
    lastName: 'one',
    title: 'CEO',
    company: 'MoretonBlue',
    hasMobile: true,
    hasTelephone: true,
    hasEmail: true,
    bio: 'Sole fullstack developer. I create web, android, and iOS apps using ReactJS, React-Native, NodeJS, AWS, and FaunaDB.'
  },
  {
    id: '2',
    firstName: 'Test',
    middleName: 'user',
    lastName: 'two',
    title: 'Fullstack developer',
    company: null,
    hasMobile: true,
    hasTelephone: false,
    hasEmail: true,
    bio: 'Sole fullstack developer. I create web, android, and iOS apps using ReactJS, React-Native, NodeJS, AWS, and FaunaDB.'
  },
  {
    id: '3',
    firstName: 'Test',
    middleName: 'user',
    lastName: 'three',
    title: 'CTO',
    company: 'Lazada',
    hasMobile: true,
    hasTelephone: false,
    hasEmail: true,
    bio: 'Sole fullstack developer. I create web, android, and iOS apps using ReactJS, React-Native, NodeJS, AWS, and FaunaDB.'
  },
  {
    id: '4',
    firstName: 'Test',
    middleName: 'user',
    lastName: 'four',
    title: 'Civil Engineer',
    company: null,
    hasMobile: true,
    hasTelephone: true,
    hasEmail: true,
    bio: 'Sole fullstack developer. I create web, android, and iOS apps using ReactJS, React-Native, NodeJS, AWS, and FaunaDB.'
  },
  {
    id: '5',
    firstName: 'Test',
    middleName: 'user',
    lastName: 'five',
    title: 'Lawyer',
    company: '',
    hasMobile: false,
    hasTelephone: false,
    hasEmail: true,
    bio: 'Sole fullstack developer. I create web, android, and iOS apps using ReactJS, React-Native, NodeJS, AWS, and FaunaDB.'
  }
];

function keyExtractor ({ id }) {
  return id;
}

function renderItem ({ item }) {
  return <ContactListRow {...item} />;
}

function ContactList () {
  return (
    <FlatList
      ListEmptyComponent={ContactListEmpty}
      ItemSeparatorComponent={ListItemSeparator}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
}

export default React.memo(ContactList);
