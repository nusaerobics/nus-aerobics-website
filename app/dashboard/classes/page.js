"use server";

import {redirect} from "next/navigation";
import {getSession} from "../../lib";
import ClassesPage from "../../components/pages/ClassesPage";

export default async function Page() {
  let redirectPath;
  let user;
  try {
    const session = await getSession();
    if (!session) {
      redirectPath = "/";
    } else {
      // TODO: only add necessary information in user i.e. the user id, all else get seperately.
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
  return <ClassesPage session={{userId: user.id, permission: user.permission}}/>;
}
