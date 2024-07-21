"use server";

import { redirect } from "next/navigation";
import { getSession } from "../lib";
import DashboardPage from "../components/pages/DashboardPage";

export default async function Page() {
  let user;
  try {
    const session = await getSession();
    if (!session) {
      redirect("/login");
    }
    user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      permission: session.user.permission,
      balance: session.user.balance,
    }  
    console.log("session on dashboard is: ", session);
    console.log("user on dashboard is: ", user);
  } catch (error) {
    console.log(error);
    redirect("/login");
  }
  return (
    <DashboardPage user={user} />
  );
}
