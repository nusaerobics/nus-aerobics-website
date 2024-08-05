"use server";

import { redirect } from "next/navigation";
import { getSession } from "./lib";
import LoginPage from "../app/components/pages/LoginPage";

export default async function Page() {
  let redirectPath;
  try {
    const session = await getSession();
    console.log(session);
    if (session) {
      redirectPath = "/dashboard";
    }
  } catch (error) {
    redirectPath = "/";
    console.log(error);
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
  return (
    <LoginPage />
  );
}
