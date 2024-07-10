"use client";

import { MdEdit } from "react-icons/md";
import { Checkbox, Input } from "@nextui-org/react";
import { PageTitle, SectionTitle } from "../../components/Titles";
import { PrimaryButton, SecondaryButton } from "../../components/Buttons";

export default function Page() {
  return (
    <div className="flex flex-col gap-y-5">
      <PageTitle title="Profile" />
      <div className="h-1/2 flex flex-col rounded-[20px] border border-[#393E4610] p-5 bg-white gap-y-2.5">
        <div className="flex flex-row items-center gap-x-2.5">
          <SectionTitle title="User details" />
          <MdEdit />
        </div>
        <div className="flex flex-col gap-y-2.5 w-[265px]">
          <p className="text-[#393E4650] text-sm">Full name</p>
          <Input
            placeholder="Nara Smith"
            radius="full"
            classNames={{
              input: ["text-[#393E46]", "placeholder:text-[#393E4650]"],
              inputWrapper: [
                // "shadow-xl",
                // "bg-default-200/50",
                // "dark:bg-default/60",
                // "backdrop-blur-xl",
                // "backdrop-saturate-200",
                // "hover:bg-default-200/70",
                // "dark:hover:bg-default/70",
                // "group-data-[focus=true]:bg-default-200/50",
                // "dark:group-data-[focus=true]:bg-default/60",
                // "!cursor-text",
              ],
            }}
          />
        </div>
        <div className="flex flex-col gap-y-2.5 items-start">
          <p className="text-[#393E4650] text-sm">Email</p>
          <div className="flex flex-row gap-x-2.5">
            <div className="w-[265px]">
              <Input
                placeholder="narasmith@email.com"
                radius="full"
                classNames={{
                  input: ["text-[#393E46]", "placeholder:text-[#393E4650]"],
                  inputWrapper: [
                    // "shadow-xl",
                    // "bg-default-200/50",
                    // "dark:bg-default/60",
                    // "backdrop-blur-xl",
                    // "backdrop-saturate-200",
                    // "hover:bg-default-200/70",
                    // "dark:hover:bg-default/70",
                    // "group-data-[focus=true]:bg-default-200/50",
                    // "dark:group-data-[focus=true]:bg-default/60",
                    // "!cursor-text",
                  ],
                }}
              />
            </div>
            <Checkbox defaultChecked color="default">
              <p> Get email notifications for upcoming classes</p>
            </Checkbox>
          </div>
        </div>
      </div>
      <div className="h-1/2 flex flex-col rounded-[20px] border border-[#393E4610] p-5 bg-white gap-y-2.5">
        <SectionTitle title="Change password" />
        <div className="flex flex-col gap-y-2.5 w-[265px]">
          <p className="text-[#393E4650] text-sm">Current password</p>
          <Input
            placeholder=""
            radius="full"
            classNames={{
              input: ["text-[#393E46]", "placeholder:text-[#393E4650]"],
              inputWrapper: [
                // "shadow-xl",
                // "bg-default-200/50",
                // "dark:bg-default/60",
                // "backdrop-blur-xl",
                // "backdrop-saturate-200",
                // "hover:bg-default-200/70",
                // "dark:hover:bg-default/70",
                // "group-data-[focus=true]:bg-default-200/50",
                // "dark:group-data-[focus=true]:bg-default/60",
                // "!cursor-text",
              ],
            }}
          />
        </div>
        <div className="flex flex-row gap-x-2.5">
          <div className="flex flex-col gap-y-2.5 w-[265px]">
            <p className="text-[#393E4650] text-sm">New password</p>
            <Input
              placeholder=""
              radius="full"
              classNames={{
                input: ["text-[#393E46]", "placeholder:text-[#393E4650]"],
                inputWrapper: [
                  // "shadow-xl",
                  // "bg-default-200/50",
                  // "dark:bg-default/60",
                  // "backdrop-blur-xl",
                  // "backdrop-saturate-200",
                  // "hover:bg-default-200/70",
                  // "dark:hover:bg-default/70",
                  // "group-data-[focus=true]:bg-default-200/50",
                  // "dark:group-data-[focus=true]:bg-default/60",
                  // "!cursor-text",
                ],
              }}
            />
          </div>
          <div className="flex flex-col gap-y-2.5 w-[265px]">
            <p className="text-[#393E4650] text-sm">Confirm password</p>
            <Input
              placeholder=""
              radius="full"
              classNames={{
                input: ["text-[#393E46]", "placeholder:text-[#393E4650]"],
                inputWrapper: [
                  // "shadow-xl",
                  // "bg-default-200/50",
                  // "dark:bg-default/60",
                  // "backdrop-blur-xl",
                  // "backdrop-saturate-200",
                  // "hover:bg-default-200/70",
                  // "dark:hover:bg-default/70",
                  // "group-data-[focus=true]:bg-default-200/50",
                  // "dark:group-data-[focus=true]:bg-default/60",
                  // "!cursor-text",
                ],
              }}
            />
          </div>
        </div>
        <div className="flex flex-row justify-end gap-x-2.5">
          <SecondaryButton label="Cancel" />
          <PrimaryButton label="Save changes" />
        </div>
      </div>
    </div>
  );
}
