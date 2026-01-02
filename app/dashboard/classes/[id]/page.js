"use server";

import { redirect } from "next/navigation";
import { getSession } from "../../../lib";
import AdminClassViewPage from "../../../components/pages/AdminClassViewPage";

export default async function Page() {
  const session = await getSession();
  
  if (!session) {
    redirect("/");
  }
  
  if (session.user.permission == "normal") {
    redirect("/dashboard");
  }

  return <AdminClassViewPage />;
}
