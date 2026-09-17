# Golf Subscription Platform Backend

## Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT auth
- Stripe checkout + webhook
- node-cron monthly draft draw job

## Setup
1. Copy `.env.example` to `.env`
2. Fill env values (MongoDB, JWT, Stripe, mail)
3. Install dependencies
   - `npm install`
4. Run in dev
   - `npm run dev`
5. Seed demo data (admin + charities)
   - `npm run seed`

## API (Core)
- Auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- User
  - `GET /api/user/profile`
  - `GET /api/user/analytics` (admin)
- Scores
  - `POST /api/scores`
  - `GET /api/scores`
- Subscription
  - `POST /api/subscriptions` (or `/api/subscribe`)
  - `POST /api/subscriptions/webhook`
  - `POST /api/webhook`
- Draw
  - `POST /api/draw/draft` (admin)
  - `POST /api/draw/:id/simulate` (admin)
  - `POST /api/draw/:id/publish` (admin)
  - `POST /api/draw/run` (admin shortcut: create + publish)
  - `GET /api/draw/latest`
  - `GET /api/draw/history`
- Charity
  - `GET /api/charities`
  - `POST /api/charities` (admin)
  - `POST /api/charities/select`
- Winners
  - `GET /api/winners`
  - `POST /api/winners/proof` (multipart file upload or URL)
  - `PATCH /api/winners/:id/status` (admin)

## Notes
- Score rule: `score` is 1-45 and `date` (`YYYY-MM-DD`) is mandatory.
- Score entry requires active subscription.
- Score history returns latest first (`date` desc, `createdAt` desc).
- Draw engine supports random and algorithm modes.
- Draw eligibility: active subscription and at least 5 scores.
- Monthly draw key format: `YYYY-MM` with duplicate-month protection.
- Prize split: 5 match 40%, 4 match 35%, 3 match 25%; winners split equally.
- Jackpot rollover: if no 5-match winner, 5-match bucket carries to next draw.
- Charity contribution is computed from subscription amount and user-selected percentage (min 10%).
- Security middleware enabled: Helmet, rate limiting, JWT expiry, bcrypt hashing.
- Postman files:
  - `docs/postman/Golf-Platform.postman_collection.json`
  - `docs/postman/Golf-Backend-Local.postman_environment.json`
- Full demo request sequence:
  - `docs/API_FLOW.md`
