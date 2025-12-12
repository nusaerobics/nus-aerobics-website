"use server";

import { redirect } from "next/navigation";
import { getSession } from "../../lib";
import ClassesPage from "../../components/pages/ClassesPage";

export default async function Page() {
  const session = await getSession();
  
  if (!session) {
    redirect("/");
  }
  // TODO: only add necessary information in user i.e. the user id, all else get seperately.
  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    permission: session.user.permission,
    balance: session.user.balance,
  };
  return <ClassesPage session={ { userId: user.id, permission: user.permission } }/>;
}
