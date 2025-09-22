const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const slugify = require("slugify");

const Post = sequelize.define("Post", {
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  body: { type: DataTypes.TEXT, allowNull: false },
  viewCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  categoryId: { type: DataTypes.INTEGER, allowNull: true },
});

Post.beforeValidate((post) => {
  if (post.title) post.slug = slugify(post.title, { lower: true });
});

module.exports = Post;
