"use server";

import { redirect } from "next/navigation";
import { getSession } from "../lib";
import DashboardPage from "../components/pages/DashboardPage";

export default async function Page() {
  let redirectPath;
  let user;
  try {
    const session = await getSession();
    if (!session) {
      redirectPath = "/";
    } else {
      user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        permission: session.user.permission,
        balance: session.user.balance,
      }
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
    <DashboardPage session={{ userId: user.id, permission: user.permission }} />
  );
}
