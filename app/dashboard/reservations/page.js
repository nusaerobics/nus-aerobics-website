"use server";

import { redirect } from "next/navigation";
import { getSession } from "../../lib";
import ReservationsPage from "../../components/pages/ReservationsPage";

export default async function Page() {
  let redirectPath;
  let user;
  try {
    const session = await getSession();
    if (!session) {
      redirectPath = "/";
    } else if (session.user.permission == "admin") {
      redirectPath = "/dashboard";
    } else {
      user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        permission: session.user.permission,
        balance: session.user.balance,
      };
    }
  } catch (error) {
    redirectPath = "/";
    console.log(error);
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
  return <ReservationsPage userId={ user.id }/>;
}
