# MiroTalk P2P — Fork with Dynamic TURN Credentials

This is a fork of [miroslavpejic85/mirotalk](https://github.com/miroslavpejic85/mirotalk) that adds support for **dynamic TURN credentials** using the coturn `use-auth-secret` / `static-auth-secret` mechanism.

## Why this fork?

The upstream MiroTalk only supports **static** TURN credentials (`TURN_SERVER_USERNAME` + `TURN_SERVER_CREDENTIAL`). This is less secure because:
- Credentials are long-lived and hardcoded
- Anyone who intercepts them can use your TURN server indefinitely

This fork generates **time-limited HMAC-SHA1 credentials** on the fly using a shared secret, matching coturn's `use-auth-secret` mechanism. Credentials expire after a configurable lifetime (default: 1 hour).

## How it works

1. When a peer joins a room via Socket.IO, the **server generates a short-lived, single-use HMAC token** and includes it in the `addPeer` event
2. **Client** uses this token to authenticate the `GET /api/turn-credentials` request
3. **Server** validates the token (HMAC signature, expiry, single-use) and returns time-limited TURN credentials
4. **coturn** validates the TURN credentials using the same shared secret (`static-auth-secret` in `turnserver.conf`)

> **Security**: The `/api/turn-credentials` endpoint is **not publicly accessible**. Only peers with an active Socket.IO connection to a room can obtain a valid token. Tokens expire in 30 seconds and are single-use.

## Configuration

Set these environment variables (or in `.env`):

```env
TURN_SERVER_ENABLED=true
TURN_SERVER_URL=turn:your-turn-server:3478
TURN_SECRET=your-coturn-static-auth-secret    # Must match turnserver.conf
TURN_USERNAME_PART=mirotalk                    # Optional (default: mirotalk)
TURN_CREDENTIAL_LIFETIME=3600                  # Optional, seconds (default: 3600)
```

When `TURN_SECRET` is set, `TURN_SERVER_USERNAME` and `TURN_SERVER_CREDENTIAL` are ignored.  
When `TURN_SECRET` is empty, the upstream static credentials behavior is preserved.

## Files changed from upstream

| File | Change |
|---|---|
| `app/src/config.template.js` | Added `turn.secret`, `turn.usernamePart`, `turn.credentialLifetime` |
| `app/src/server.js` | Added `crypto` import, dynamic TURN logic, `/api/turn-credentials` endpoint |
| `public/js/fetchTurnCredentials.js` | **New** — client-side helper to fetch dynamic credentials |
| `public/js/client.js` | Fetches dynamic TURN credentials in `handleAddPeer` |
| `public/views/client.html` | Added `fetchTurnCredentials.js` script tag |
| `.env.template` | Added `TURN_SECRET`, `TURN_USERNAME_PART`, `TURN_CREDENTIAL_LIFETIME` |

## Syncing with upstream

```bash
git fetch upstream
git merge upstream/master
# Resolve any conflicts in the files listed above
```
