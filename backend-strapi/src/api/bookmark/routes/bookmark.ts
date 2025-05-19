export default {
  routes: [
    {
      method: 'POST',
      path: '/bookmark/:id',
      handler: 'bookmark.add',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/bookmark/:id',
      handler: 'bookmark.remove',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
