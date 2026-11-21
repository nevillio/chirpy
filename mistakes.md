# Mistakes & learnings

## 1. I stored the JWT in the database

I added a `users.token` column because I thought the server needed to keep the JWT it issued. It doesn't.

A JWT is self-contained: it carries the user id (`sub`), `iat`, and `exp`, and it is signed with `SECRET`. On later requests the server just verifies the signature and reads `sub` back out. No DB lookup and no stored token are needed.

Takeaway: don't persist JWTs in a `users.token` column. For revocation, use short expiry/rotation or a proper session/denylist design instead.

## 2. I assumed a token was only `\w` characters

`extractBearerToken` used:

```ts
/(?<scheme>\w+) (?<token>\w+)/
```

But `\w` is only `[A-Za-z0-9_]`. A real JWT has three base64url segments separated by `.`, and base64url can contain `-` and `_`. So `.` and `-` are valid characters too, and my regex rejected real tokens.

Use:

```ts
/(?<scheme>\w+)\s+(?<token>[A-Za-z0-9._-]+)/
```

Takeaway: match the actual token alphabet (`A-Z a-z 0-9 . _ -`), not just word characters.
