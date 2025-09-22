const { sequelize, Category, Post, Tag } = require("./models");

async function main() {
  await sequelize.sync({ force: true });

  // Categories (generic)
  const [general, travel, research] = await Promise.all([
    Category.create({ name: "General",  description: "Assorted notes and updates" }),
    Category.create({ name: "Travel",   description: "Journeys, routes, itineraries" }),
    Category.create({ name: "Research", description: "Findings, experiments, ideas" }),
  ]);

  // Tags
  const [tips, notes, routes, night, fauna, ideas] = await Promise.all(
    ["Tips", "Notes", "Routes", "NightSky", "Fauna", "Ideas"].map(name => Tag.create({ name }))
  );

  // Posts (lorem ipsum)
  const p1 = await Post.create({
    title: "Dolor sit amet basics",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non massa sed lorem fermentum.",
    categoryId: general.id,
    viewCount: 8,
  });
  await p1.addTagLists([tips, notes]);

  const p2 = await Post.create({
    title: "Paths and places",
    description: "Vivamus sagittis lacus vel augue laoreet rutrum.",
    body: "Curabitur blandit tempus porttitor. Praesent commodo cursus magna, vel scelerisque nisl consectetur.",
    categoryId: travel.id,
    viewCount: 15,
  });
  await p2.addTagLists([routes, tips]);

  const p3 = await Post.create({
    title: "Noctis observatio",
    description: "Etiam porta sem malesuada magna mollis euismod.",
    body: "Cras mattis consectetur purus sit amet fermentum. Nullam id dolor id nibh ultricies vehicula.",
    categoryId: travel.id,
    viewCount: 21,
  });
  await p3.addTagLists([night, routes]);

  const p4 = await Post.create({
    title: "Field notes on fauna",
    description: "Donec sed odio dui. Aenean lacinia bibendum nulla sed consectetur.",
    body: "Maecenas faucibus mollis interdum. Sed posuere consectetur est at lobortis.",
    categoryId: research.id,
    viewCount: 5,
  });
  await p4.addTagLists([fauna, ideas]);

  console.log("Seeded generic content.");
}

if (require.main === module) {
  main().then(()=>process.exit(0)).catch(e=>{ console.error(e); process.exit(1); });
}

module.exports = { main };
