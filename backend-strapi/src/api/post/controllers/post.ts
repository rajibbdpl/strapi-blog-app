import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  async create(ctx) {
    // Log user info and role from context (ctx.state.user is the authenticated user)
    console.log('Authenticated user info:', ctx.state.user);
    if (ctx.state.user && ctx.state.user.role) {
      console.log('User role:', ctx.state.user.role.name);
    } else {
      console.log('No user or role found in ctx.state.user');
    }

    // Now call the default core create controller to keep normal behavior
    const response = await super.create(ctx);

    return response;
  },
}));
