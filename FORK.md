# MiroTalk P2P — Fork with Dynamic TURN Credentials

This is a fork of [miroslavpejic85/mirotalk](https://github.com/miroslavpejic85/mirotalk) that adds support for **dynamic TURN credentials** using the coturn `use-auth-secret` / `static-auth-secret` mechanism.

## Why this fork?

The upstream MiroTalk only supports **static** TURN credentials (`TURN_SERVER_USERNAME` + `TURN_SERVER_CREDENTIAL`). This is less secure because:
- Credentials are long-lived and hardcoded
- Anyone who intercepts them can use your TURN server indefinitely

This fork generates **time-limited HMAC-SHA1 credentials** on the fly using a shared secret, matching coturn's `use-auth-secret` mechanism. Credentials expire after a configurable lifetime (default: 1 hour).

## How it works

1. **Server** exposes `/api/turn-credentials` that generates temporary credentials using `TURN_SECRET`
2. **Client** calls this endpoint before each peer connection to get fresh credentials
3. **coturn** validates them using the same shared secret (`static-auth-secret` in `turnserver.conf`)

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
