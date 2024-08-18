import { redirect } from "next/navigation";
import { getSession } from "../lib";
import SideBar from "../components/dashboard/SideBar";

export default async function Layout({ children }) {
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

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-64 flex-none">
        <SideBar session={{ permission: user.permission }} />
      </div>
      <div className="w-full h-full bg-a-pink/80 gap-y-5 font-poppins text-a-black text-xs md:text-sm">
        {children}
      </div>
    </div>
  );
}
