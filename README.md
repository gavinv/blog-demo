# Generic Blog Demo (Posts w/ Categories + Recommendations)

📹 [Loom Demo](https://www.loom.com/share/e76701cd198e4aab876ad3d233a06780?sid=d5bd796d-58ee-4ff4-a6c2-6f5c6479c0b9)

**Endpoints**

- `GET /categories` — list categories
- `GET /posts/:slug` — includes `category`, `tagLists`, `viewCount`
- `POST /posts/:slug/viewed` — atomic increment
- `GET /posts/:slug/recommendations` — same category or tag overlap, sorted by `viewCount`
- `POST /posts` — accepts `{ post: { title, body, categoryId, tagList[] } }`

## Run

```bash
npm i
npm run dev   # seeds SQLite and starts on :3001
```

## Try it

```bash
curl -s localhost:3001/categories
curl -s localhost:3001/posts/dolor-sit-amet-basics
curl -s -X POST localhost:3001/posts/dolor-sit-amet-basics/viewed
curl -s localhost:3001/posts/dolor-sit-amet-basics/recommendations
```

## Notes

- SQLite for simplicity, no auth.
- Sorting: viewCount desc → tag overlap → small category boost.
