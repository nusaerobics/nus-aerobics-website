import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createSecretKey } from "crypto";

const secretKey = createSecretKey(process.env.TOKEN_SECRET, "utf-8");

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 sec from now")
    .sign(secretKey);
}

export async function decrypt(input) {
  const { payload } = await jwtVerify(input, secretKey, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function getSession() {
  const session = cookies().get("session").value;
  if (!session) {
    return null;
  }
  return await decrypt(session);
}
