# Check: Is better-auth creating User and Account for credential sign-ups?

## Credential sign-up flow (better-auth)

1. **POST /api/auth/sign-up/email** with `{ name, email, password }`
2. **createUser**: inserts into `user` with `email`, `name`, `image?`, `emailVerified: false`, `createdAt`, `updatedAt`. `id` is left to Prisma `@default(uuid())`.
3. **linkAccount**: inserts into `account` with `userId`, `providerId: "credential"`, `accountId: user.id`, `password: hash`, `createdAt`, `updatedAt`.

If either step fails, the whole flow runs in a transaction and is rolled back.

## Schema compatibility (Prisma vs better-auth)

| Model   | better-auth expects (fieldName) | Your Prisma | OK? |
|---------|----------------------------------|-------------|-----|
| **User**  | name, email, emailVerified, image?, createdAt, updatedAt | ✅ All present. Extra: bookingId?, gender?, collegeName?, mobileNo?, role? (optional). | ✅ |
| **Account** | accountId, providerId, userId, password?, createdAt, updatedAt | ✅ All present. password is String? | ✅ |
| **Session** | expiresAt, token, userId, createdAt, updatedAt, ipAddress?, userAgent? | ✅ Matches. `token` has @@unique. | ✅ |

- **User.emailVerified**: required, no `@default` in your schema. better-auth always sends `emailVerified: false` on sign-up. ✅  
- **Account.createdAt / updatedAt**: no `@default` in your schema. better-auth always sends them. ✅  
- **Session**: used only when a session is created (after sign-up or sign-in). ✅  

No schema mismatch was found that would prevent User or Account from being created for credential sign-ups.

## Diagnostic endpoint

**GET /api/admin/check-auth-users** (admin only, requires logged-in admin session)

Example (browser): while logged in as admin, open:

```
https://your-domain/api/admin/check-auth-users
```

Or with curl (reuse a session cookie from the browser):

```bash
curl -b "better-auth.session_token=YOUR_SESSION_COOKIE" "http://localhost:3000/api/admin/check-auth-users"
```

Response shape:

```json
{
  "userCount": 10,
  "bySignInMethod": {
    "credential": 3,
    "google": 5,
    "github": 2,
    "noAccount": 0
  },
  "recentUsers": [
    { "id", "email", "name", "emailVerified", "createdAt", "providers": ["credential"] }
  ],
  "schemaNote": "..."
}
```

- **credential**: users who have at least one `account` with `providerId === "credential"`.
- **noAccount**: users with no `account` row. This is unexpected for both OAuth and credential; it can indicate a failed `linkAccount` or a legacy user.

## Interpreting results

- If **credential > 0**: better-auth is creating User + Account for email/password sign-ups. If the admin dashboard still undercounts, the cause is elsewhere (e.g. which Prisma/DB the admin reads from).
- If **credential === 0** but you have signed up with email/password: either sign-up is failing (check Network tab for 4xx/5xx on `/api/auth/sign-up/email` and server logs) or the `account` insert is failing (DB constraint, wrong DB, etc.).
- **noAccount > 0**: some users have no linked account; worth inspecting those rows and how they were created.

## If sign-up fails

1. **Network**: Inspect the `sign-up/email` request/response (status, body).
2. **Logs**: In development, better-auth may log “Failed to create user” or similar.
3. **DB**: Confirm `user` and `account` tables exist and match the Prisma schema; try a manual insert for a test user + credential account to rule out constraints.
