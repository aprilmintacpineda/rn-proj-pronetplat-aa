export default {
  status: 200,
  json: () => ({
    authUser: {
      id: 1,
      email: 'april@moretonblue.com',
      emailVerifiedAt: new Date().toISOString()
    },
    authToken: 'abc'
  })
};
