"use server";

import { redirect } from "next/navigation";
import { getSession } from "../../lib";
import ClassesPage from "../../components/pages/ClassesPage";

export default async function Page() {
  let user;
  try {
    const session = await getSession();
    if (!session) {
      redirect("/");
    }
    user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      permission: session.user.permission,
      balance: session.user.balance,
    }
  } catch (error) {
    console.log(error);
    redirect("/");
  }
  return <ClassesPage user={user} />;
}
