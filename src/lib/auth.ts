import { SignJWT, jwtVerify } from "jose";

type AdminJwtPayload = {
  sub: string;
  username: string;
  role: string;
};

const getSecretKey = () => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("Missing AUTH_SECRET");
  }
  return new TextEncoder().encode(secret);
};

export async function signAdminJwt(payload: AdminJwtPayload) {
  const secret = getSecretKey();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(secret);
}

export async function verifyAdminJwt(token: string) {
  const secret = getSecretKey();
  const { payload } = await jwtVerify<AdminJwtPayload>(token, secret);
  return payload;
}
