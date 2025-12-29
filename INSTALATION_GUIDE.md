```bash
npm install
```

Make sure you have a .env file with DATABASE_URL
Also get BETTER_AUTH_SECRET and BETTER_AUTH_URL as described in better auth instalation guide: https://www.better-auth.com/docs/installation

Then maybe do some of this stuff???

```bash
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
npx prisma migrate deploy
npx tsx prisma/seed-tmdb.ts
npx prisma studio
npm run dev
```

And check out this page to see if better auth is working: http://localhost:3000/api/auth/get-session
If it works, the page should say 'null'

To use old seed function, use `npm run db:seed`
