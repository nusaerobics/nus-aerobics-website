import NavBar from "../components/dashboard/navbar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <NavBar />
      </div>
      {/* TODO: Go through and ensure font sizing is standard */}
      <div className="w-full h-screen p-10 pt-20 bg-a-pink/80 gap-y-5 md:overflow-y-auto font-poppins text-a-black text-sm">{children}</div>
    </div>
  );
}
