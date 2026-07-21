export default {
  title: 'Django 金鑰產生器',
  length: '長度:',
  generateNew: '產生新金鑰',
  copy: '複製',
  copied: '已複製到剪貼簿！',
  secretKeyHint: 'Django 的標準密鑰，用於 CSRF、Session、密碼重設 Token 等。請設定為 Django settings 中的 SECRET_KEY。',
  jwtSigningKeyHint: '用於簽署 HS256 演算法的 JWT access/refresh token（例如 SimpleJWT）。請設定為 Django 後端環境變數中的 JWT_SIGNING_KEY。HS256 最少需 32 字元（256-bit）。',
  fernetKeyHint: 'URL-safe Fernet 金鑰，用於欄位層級加密（如 django-cryptography）。請設定為 Django settings 中的 FIELD_ENCRYPTION_KEYS。',
}
