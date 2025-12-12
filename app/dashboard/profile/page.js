"use server";

import { redirect } from "next/navigation";
import { getSession } from "../../lib";
import ProfilePage from "../../components/pages/ProfilePage";

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
  return <ProfilePage session={ { userId: user.id } }/>;
}
