export default {
  async beforeCreate(event) {
    const { data } = await event.params;

    if (!data.publishedDate || data.publishedDate === "") {
      //set current date by default when publishing a new content
      data.publishedDate = new Date().toISOString();
    }
  },
};
