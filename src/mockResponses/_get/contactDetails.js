export default {
  status: 200,
  json: () => ({
    data: [
      {
        id: '1',
        type: 'email',
        value: 'test@user1.com'
      },
      {
        id: '2',
        type: 'email',
        value: 'test@user1.com'
      },
      {
        id: '3',
        type: 'mobile',
        value: '6523426'
      },
      {
        id: '4',
        type: 'telephone',
        value: '73564567'
      }
    ],
    nextToken: null
  })
};
