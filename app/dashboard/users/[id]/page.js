"use client";

import { useParams } from "next/navigation";
import UsersViewPage from "../../../components/pages/UsersViewPage";

export default async function Page() {
  const params = useParams();
  const userId = params.id;

  // TODO: return <WalletPage session={{ userId: user.id, permission: user.permission }} />;
  return <UsersViewPage userId={userId} />;
}
