"use server";

import { redirect } from "next/navigation";
import { getSession } from "../../lib";
import WalletPage from "../../components/pages/WalletPage";

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
  // TODO: Fix not giving user across pages when values are dynamic - only give values which aren't changing
  return <WalletPage session={{ userId: user.id, permission: user.permission }} />;
}
