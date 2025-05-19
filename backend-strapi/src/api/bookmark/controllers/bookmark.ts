//we have to export and object
//not use export default

export const getBookmarks = async (ctx) => {
  const userId = ctx?.state?.user?.id;
  if (!userId) return ctx.unauthorized("Authentication required");

  const user = await strapi.entityService.findOne(
    "plugin::users-permissions.user",
    userId,
    { populate: ["bookmarkedPosts"] }
  );

  if (!user) return ctx.notFound("User not found");

  ctx.send({ bookmarkedPosts: user.bookmarkedPosts });
};

export const addBookmark = async (ctx) => {
  const userId = ctx?.state?.user?.id;
  if (!userId) return ctx.unauthorized("Authentication required");

  const postId = parseInt(ctx.params.postId);

  const user = await strapi.entityService.findOne(
    "plugin::users-permissions.user",
    userId,
    { populate: ["bookmarkedPosts"] }
  );

  const existingPostIds = user.bookmarkedPosts.map((p) => p.id);
  if (existingPostIds.includes(postId)) {
    return ctx.badRequest("Already bookmarked");
  }

  await strapi.entityService.update("plugin::users-permissions.user", userId, {
    data: { bookmarkedPosts: [...existingPostIds, postId] },
  });

  ctx.send({ message: "Post bookmarked" });
};

export const removeBookmark = async (ctx) => {
  const userId = ctx?.state?.user?.id;
  if (!userId) return ctx.unauthorized("Authentication required");

  const postId = parseInt(ctx.params.postId);

  const user = await strapi.entityService.findOne(
    "plugin::users-permissions.user",
    userId,
    { populate: ["bookmarkedPosts"] }
  );

  const updated = user.bookmarkedPosts
    .map((p) => p.id)
    .filter((id) => id !== postId);

  await strapi.entityService.update("plugin::users-permissions.user", userId, {
    data: { bookmarkedPosts: updated },
  });

  ctx.send({ message: "Post unbookmarked" });
};
