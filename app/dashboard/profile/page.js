"use server";

import { redirect } from "next/navigation";
import { getSession } from "../../lib";
import ProfilePage from "../../components/pages/ProfilePage";

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
  return <ProfilePage session={ { userId: user.id } }/>;
}
