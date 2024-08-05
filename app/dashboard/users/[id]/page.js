"use client";

import { useParams } from "next/navigation";
import UsersViewPage from "../../../components/pages/UsersViewPage";

export default async function Page() {
  const params = useParams();
  const userId = params.id;

  return <UsersViewPage userId={userId} />;
}
