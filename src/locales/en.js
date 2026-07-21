export default {
  title: 'Django Key Generators',
  length: 'Length:',
  generateNew: 'Generate New',
  copy: 'Copy',
  copied: 'Copied to clipboard!',
  secretKeyHint: "Django's standard secret key for CSRF, sessions, password reset tokens, etc. Set as SECRET_KEY in your Django settings.",
  jwtSigningKeyHint: 'Signs HS256 JWT access/refresh tokens (e.g. SimpleJWT). Set as JWT_SIGNING_KEY in your Django backend environment. Minimum 32 chars (256-bit) for HS256.',
  fernetKeyHint: 'URL-safe Fernet key for field-level encryption (e.g. django-cryptography). Set as FIELD_ENCRYPTION_KEYS in your Django settings.',
}
