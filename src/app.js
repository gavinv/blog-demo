const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize");
const { Category, Post, Tag } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/categories", async (_req, res) => {
  const categories = await Category.findAll({
    attributes: ["id", "name", "description"],
    order: [["name", "ASC"]],
  });
  res.json({ categories });
});

app.post("/posts", async (req, res) => {
  const { title, description, body, categoryId, tagList = [] } = req.body.post || req.body;
  if (!title || !body) return res.status(400).json({ error: "title and body required" });

  const post = await Post.create({ title, description, body, categoryId: categoryId ?? null });
  for (const t of tagList) {
    const name = String(t).trim();
    if (!name) continue;
    const [tag] = await Tag.findOrCreate({ where: { name }, defaults: { name } });
    await post.addTagList(tag);
  }

  const full = await Post.findOne({
    where: { slug: post.slug },
    include: [
      { model: Category, as: "category", attributes: ["id", "name"] },
      { model: Tag, as: "tagLists", attributes: ["name"], through: { attributes: [] } },
    ],
  });

  res.status(201).json({ post: full });
});


app.get("/posts/:slug", async (req, res) => {
  const post = await Post.findOne({
    where: { slug: req.params.slug },
    include: [
      { model: Category, as: "category", attributes: ["id", "name"] },
      { model: Tag, as: "tagLists", attributes: ["name"], through: { attributes: [] } },
    ],
  });
  if (!post) return res.status(404).json({ error: "not found" });
  res.json({ post });
});

app.post("/posts/:slug/viewed", async (req, res) => {
  const post = await Post.findOne({ where: { slug: req.params.slug } });
  if (!post) return res.status(404).json({ error: "not found" });
  await post.increment("viewCount", { by: 1 });
  await post.reload({ attributes: ["viewCount"] });
  res.json({ viewCount: post.viewCount });
});

app.get("/posts/:slug/recommendations", async (req, res) => {
  const current = await Post.findOne({
    where: { slug: req.params.slug },
    include: [
      { model: Category, as: "category", attributes: ["id"] },
      { model: Tag, as: "tagLists", attributes: ["name"], through: { attributes: [] } },
    ],
    attributes: ["id", "slug", "title", "viewCount", "categoryId"],
  });
  if (!current) return res.status(404).json({ error: "not found" });

  const currentTags = new Set(current.tagLists.map(t => t.name));

  const candidates = await Post.findAll({
    where: { slug: { [Op.ne]: current.slug } },
    include: [
      { model: Category, as: "category", attributes: ["id"] },
      { model: Tag, as: "tagLists", attributes: ["name"], through: { attributes: [] } },
    ],
    attributes: ["slug", "title", "viewCount", "categoryId"],
  });

  const scored = candidates.map(p => {
    const overlap = p.tagLists.filter(t => currentTags.has(t.name)).length;
    const sameCat = current.categoryId && p.categoryId && p.categoryId === current.categoryId;
    return { p, overlap, sameCat };
  })
  .filter(x => x.sameCat || x.overlap > 0)
  .sort((a, b) => {
    if (b.p.viewCount !== a.p.viewCount) return b.p.viewCount - a.p.viewCount; 
    if (b.overlap !== a.overlap) return b.overlap - a.overlap;
    return (b.sameCat ? 1 : 0) - (a.sameCat ? 1 : 0);
  })
  .slice(0, 5)
  .map(({ p }) => ({ slug: p.slug, title: p.title, viewCount: p.viewCount }));

  res.json({ recommendations: scored });
});

module.exports = app;
