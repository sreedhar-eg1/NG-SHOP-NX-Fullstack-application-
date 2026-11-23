import { Request } from "express";
import { expressjwt } from "express-jwt";
import { Jwt } from "jsonwebtoken";

export function authJwt() {
  const secret = process.env.SECRET as string;
  const api = process.env.API_URL as string;

  return expressjwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevokedCallback,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/orders(.*)/, methods: ["GET", "POST", "OPTIONS"] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

async function isRevokedCallback(
  _req: Request,
  token: Jwt | undefined,
): Promise<boolean> {
  const payload = token?.payload as { isAdmin: boolean } | undefined;
  return !payload?.isAdmin;
}
