"use server";

import { redirect } from "next/navigation";
import { getSession } from "../lib";
import DashboardPage from "../components/pages/DashboardPage";

export default async function Page() {
  const session = await getSession();
  
  if (!session) {
    redirect("/");
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    permission: session.user.permission,
    balance: session.user.balance,
  };
  return (
    <DashboardPage session={{ userId: user.id, permission: user.permission }} />
  );
}
