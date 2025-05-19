export default [
  {
    method: "GET",
    path: "/bookmarks",
    handler: "bookmark.getBookmarks", 
    config: {
      auth: {
        scope: ["plugin::users-permissions.user.me"],
      },
    },
  },
  {
    method: "POST",
    path: "/bookmarks/:postId",
    handler: "bookmark.addBookmark",
    config: {
      auth: {
        scope: ["plugin::users-permissions.user.me"],
      },
    },
  },
  {
    method: "DELETE",
    path: "/bookmarks/:postId",
    handler: "bookmark.removeBookmark",
    config: {
      auth: {
        scope: ["plugin::users-permissions.user.me"],
      },
    },
  },
];
