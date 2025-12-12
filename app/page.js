"use server";

import { redirect } from "next/navigation";
import { getSession } from "./lib";
import LoginPage from "../app/components/pages/LoginPage";

export default async function Page() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard")
  }
  return (
    <LoginPage />
  );
}
