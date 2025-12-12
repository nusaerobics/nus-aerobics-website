"use server";

import { redirect } from "next/navigation";
import { getSession } from "../../lib";
import ReservationsPage from "../../components/pages/ReservationsPage";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";

export default async function Page() {
  const session = await getSession();
  
  if (!session) {
    redirect("/");
  }

  if (session.user.permission == "admin") {
    redirect("/dashboard");
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    permission: session.user.permission,
    balance: session.user.balance,
  };
  return <ReservationsPage session={ { userId: user.id } }/>;
}
