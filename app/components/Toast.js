import clsx from "clsx";
import { MdCheckCircleOutline, MdOutlineCancel } from "react-icons/md";

export default function Toast({ isSuccess, header, message }) {
  return (
    <div
      className={clsx(
        "flex flex-row items-center justify-center z-10 bottom-5 right-5 gap-x-5 px-2.5 py-5 absolute rounded-[20px] border-l-[4px]",
        {
          "border-l-a-green bg-[#EAF6EB]": isSuccess,
          "border-l-a-red bg-[#F6EAEA]": !isSuccess,
        }
      )}
    >
      {isSuccess ? (
        <MdCheckCircleOutline size={36} color={"#2A9E2F"} />
      ) : (
        <MdOutlineCancel size={36} color={"#9E2A2A"} />
      )}
      <div className="flex flex-col gap-y-0">
        <p
          className={clsx("font-bold text-sm", {
            "text-a-green": isSuccess,
            "text-a-red": !isSuccess,
          })}
        >
          {header}
        </p>
        <p className="w-[250px] text-xs text-a-black">{message}</p>
      </div>
    </div>
  );
}
