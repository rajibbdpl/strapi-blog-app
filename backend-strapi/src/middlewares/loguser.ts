module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    console.log('Middleware Log - Authenticated user:', ctx.state.user);
    await next();
  };
};
