const app = require("./app");
const { main: seed } = require("./seed");

(async () => {
  await seed();
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
})();
