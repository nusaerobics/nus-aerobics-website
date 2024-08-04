import { redirect } from "next/navigation";
import { getSession } from "../lib";
import SideBar from "../components/dashboard/SideBar";

export default async function Layout({ children }) {
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
    };
  } catch (error) {
    console.log(error);
    redirect("/");
  }
  return (
    <div className="w-screen h-screen flex flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideBar user={user} />
      </div>
      {/* TODO: Go through and ensure font sizing is standard */}
      <div className="w-full h-full bg-a-pink/80 gap-y-5 font-poppins text-a-black text-sm">
        {children}
      </div>
    </div>
  );
}
