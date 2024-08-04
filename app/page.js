"use server";

import { redirect } from "next/navigation";
import { getSession } from "./lib";
import LoginPage from "../app/components/pages/LoginPage";

export default async function Page() {
  try {
    const session = await getSession();
    if (session) {
      redirect("/dashboard");
    }
  } catch (error) {
    console.log(error);
  }
  return (
    <LoginPage />
  );
}
