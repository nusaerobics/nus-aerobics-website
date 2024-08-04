"use client";

import { useParams } from "next/navigation";
import AdminClassViewPage from "../../../components/pages/AdminClassViewPage";

export default async function Page() {
  const params = useParams();
  const classId = params.id;
  // TODO: return <WalletPage session={{ userId: user.id, permission: user.permission }} />;
  return <AdminClassViewPage classId={classId} />;
}
