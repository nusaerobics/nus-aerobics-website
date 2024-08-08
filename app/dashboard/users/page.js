"use server";

import { redirect } from "next/navigation";
import { getSession } from "../../lib";
import UsersPage from "../../components/pages/UsersPage";

export default async function Page() {
  let redirectPath;
  try {
    const session = await getSession();
    if (!session) {
      redirectPath = "/";
    } else if (session.user.permission == "normal") {
      redirectPath = "/dashboard";
    }
  } catch (error) {
    redirectPath = "/";
    console.log(error);
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
  return <UsersPage />;
}
