# Django Key Generators

A client-side tool for generating the cryptographic secrets commonly used in a Django project:

- `SECRET_KEY` — Django's standard secret key
- `JWT_SIGNING_KEY` — for HS256 JWT access/refresh tokens (e.g. SimpleJWT)
- `FIELD_ENCRYPTION_KEYS` — URL-safe Fernet key for field-level encryption

All generation happens entirely in the browser using the Web Crypto API — no keys are ever sent over the network.

Built with Vue 3 and Vite.
