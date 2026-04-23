// 简单的密码哈希（生产环境应使用 bcrypt）
export function hashPassword(password: string): string {
  // 使用简单的 SHA-256 哈希（demo 用途）
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// 简单的 JWT（demo 用途，生产环境应使用 jose 或 jsonwebtoken）
export function createToken(userId: number, email: string): string {
  const payload = {
    userId,
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 天过期
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function verifyToken(token: string): { userId: number; email: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (payload.exp < Date.now()) return null;
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}
