const sequelize = require("../db");
const { DataTypes } = require("sequelize");
const Category = require("./Category");
const Post = require("./Post");
const Tag = require("./Tag");

const PostTag = sequelize.define("PostTag", {
  PostId: { type: DataTypes.INTEGER, allowNull: false },
  TagId: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: false });

Post.belongsTo(Category, { as: "category", foreignKey: "categoryId" });
Category.hasMany(Post, { as: "posts", foreignKey: "categoryId" });

Post.belongsToMany(Tag, { as: "tagLists", through: PostTag });
Tag.belongsToMany(Post, { as: "posts", through: PostTag });

module.exports = { sequelize, Category, Post, Tag, PostTag };
