# Generic Blog Demo (Categories + Recommendations)

**Purpose:** neutral, copy-safe demo showing:

- Categories (`Category`, `Post.categoryId`)
- `GET /categories`
- Create post with `categoryId` + `tagList`
- `GET /posts/:slug` (includes `category`, `tagLists`, `viewCount`)
- Increment views: `POST /posts/:slug/viewed`
- Recommendations: `GET /posts/:slug/recommendations` (same category/tag overlap; sorted by `viewCount`)

## Run

npm i
npm run dev

## Try it

curl localhost:3001/categories
curl localhost:3001/posts/dolor-sit-amet-basics
curl -X POST localhost:3001/posts/dolor-sit-amet-basics/viewed
curl localhost:3001/posts/dolor-sit-amet-basics/recommendations

## Notes

- SQLite for simplicity, no auth.
- Sorting: viewCount desc → tag overlap → small category boost.
