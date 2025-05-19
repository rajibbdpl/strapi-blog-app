export default {
  add: async (ctx) => {
    const user = ctx.state.user;
    const postId = ctx.params.id;

    if (!user) return ctx.unauthorized('Authentication required.');

    try {
      
      const userData = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        user.id,
        {
          populate: ['bookmarks'],
        }
      ) as {
        id: number;
        bookmarks?: { id: number }[];
      };

      const existingBookmarks = userData.bookmarks || [];

      const alreadyBookmarked = existingBookmarks.some(
        (p) => p.id === Number(postId)
      );

      if (alreadyBookmarked) {
        ctx.body = { message: 'Already bookmarked' };
        return;
      }

      const updatedBookmarks = [...existingBookmarks.map((b) => b.id), Number(postId)];

      await strapi.entityService.update('plugin::users-permissions.user', user.id, {
        data: {
          bookmarks: updatedBookmarks as any,
        },
      });

      ctx.body = { message: 'Post bookmarked successfully.' };
    } catch (err) {
      ctx.throw(500, 'Failed to bookmark post.');
    }
  },

  remove: async (ctx) => {
    const user = ctx.state.user;
    const postId = ctx.params.id;

    if (!user) return ctx.unauthorized('Authentication required.');

    try {
      const userData = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        user.id,
        {
          populate: ['bookmarks'],
        }
      ) as {
        id: number;
        bookmarks?: { id: number }[];
      };

      const existingBookmarks = userData.bookmarks || [];

      const updatedBookmarks = existingBookmarks
        .filter((p) => p.id !== Number(postId))
        .map((b) => b.id);

      await strapi.entityService.update('plugin::users-permissions.user', user.id, {
        data: {
          bookmarks: updatedBookmarks as any,
        },
      });

      ctx.body = { message: 'Post unbookmarked successfully.' };
    } catch (err) {
      ctx.throw(500, 'Failed to unbookmark post.');
    }
  },
};
