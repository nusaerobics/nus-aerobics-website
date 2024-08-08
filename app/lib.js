import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createSecretKey } from "crypto";

const secretKey = createSecretKey(process.env.TOKEN_SECRET, "utf-8");

export async function encrypt(payload) {
  console.log(payload);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 day from now")
    .sign(secretKey);
}

export async function decrypt(input) {
  const { payload } = await jwtVerify(input, secretKey, {
    algorithms: ["HS256"],
  });
  return payload;
}

// https://nextjs.org/docs/messages/dynamic-server-error
export async function getSession() {
  const session = cookies().get("session");
  if (session == undefined) return null;

  const sessionValue = session.value;
  return await decrypt(sessionValue);
}
