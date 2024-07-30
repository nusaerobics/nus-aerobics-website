import NavBar from "../components/dashboard/navbar";
import { redirect } from "next/navigation";
import { getSession } from "../lib";

export default async function Layout({ children }) {
  let user;
  try {
    const session = await getSession();
    if (!session) {
      redirect("/login");
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
    redirect("/login");
  }
  return (
    // TODO: Make sure the overflow makes sense here too
    <div className="w-screen h-screen flex flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <NavBar user={user} />
      </div>
      {/* TODO: Go through and ensure font sizing is standard */}
      <div className="w-full h-screen p-10 pt-20 bg-a-pink/80 gap-y-5 md:overflow-y-auto font-poppins text-a-black text-sm">
        {children}
      </div>
    </div>
  );
}
