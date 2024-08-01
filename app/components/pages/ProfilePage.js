"use client";

import { MdEdit, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Checkbox, Input } from "@nextui-org/react";
import { PageTitle, SectionTitle } from "../utils/Titles";
import { inputClassNames } from "../utils/ClassNames";
import { useState } from "react";

export default function ProfilePage({ user }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPW, setCurrentPW] = useState("");
  const [newPW, setNewPW] = useState("");
  const [confirmPW, setConfirmPW] = useState("");

  const [isCurrentPWVisible, setIsCurrentPWVisible] = useState(false);
  const [isNewPWVisible, setIsNewPWVisible] = useState(false);
  const [isConfirmPWVisible, setIsConfirmPWVisible] = useState(false);

  const toggleCurrentPW = () => {
    setIsCurrentPWVisible(!isCurrentPWVisible);
  };
  const toggleNewPW = () => {
    setIsNewPWVisible(!isNewPWVisible);
  };
  const toggleConfirmPW = () => {
    setIsConfirmPWVisible(!isConfirmPWVisible);
  };

  return (
    <div className="flex flex-col gap-y-5 p-10 pt-20 overflow-y-scroll">
      <PageTitle title="Profile" />
      <div className="h-1/2 flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
        <div className="flex flex-row items-center gap-x-2.5">
          <SectionTitle title="User details" />
          <MdEdit />
        </div>
        <div className="flex flex-col gap-y-2.5 w-[265px]">
          <p className="text-a-black/50 text-sm">Full name</p>
          <Input
            value={name}
            onValueChange={setName}
            variant="bordered"
            size="xs"
            classNames={inputClassNames}
          />
        </div>
        <div className="flex flex-col gap-y-2.5 items-start">
          <p className="text-a-black/50 text-sm">Email</p>
          <div className="flex flex-row gap-x-2.5">
            <div className="w-[265px]">
              <Input
                value={email}
                onValueChange={setEmail}
                variant="bordered"
                size="xs"
                classNames={inputClassNames}
              />
            </div>
            {/* TODO: (NTH) Implement logic for email notifcations */}
            <Checkbox defaultChecked color="default">
              <p className="text-a-black text-sm"> Get email notifications</p>
            </Checkbox>
          </div>
        </div>
      </div>
      <div className="h-1/2 flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
        {/* TODO: Implement logic for password resets */}
        <SectionTitle title="Change password" />
        <div className="flex flex-col gap-y-2.5 w-[265px]">
          <p className="text-a-black/50 text-sm">Current password</p>
          <Input
            value={currentPW}
            onValueChange={setCurrentPW}
            type={isCurrentPWVisible ? "text" : "password"}
            endContent={
              <button
                className="focus:outline-none cursor-pointer"
                type="button"
                onClick={toggleCurrentPW}
              >
                {isCurrentPWVisible ? (
                  <MdVisibilityOff className="text-2xl text-a-black/50 pointer-events-none" />
                ) : (
                  <MdVisibility className="text-2xl text-a-black/50 pointer-events-none" />
                )}
              </button>
            }
            variant="bordered"
            size="sm"
            classNames={inputClassNames}
          />
        </div>
        <div className="flex flex-row gap-x-2.5">
          <div className="flex flex-col gap-y-2.5 w-[265px]">
            <p className="text-a-black/50 text-sm">New password</p>
            <Input
              value={newPW}
              onValueChange={setNewPW}
              type={isNewPWVisible ? "text" : "password"}
              endContent={
                <button
                  className="focus:outline-none cursor-pointer"
                  type="button"
                  onClick={toggleNewPW}
                >
                  {isNewPWVisible ? (
                    <MdVisibilityOff className="text-2xl text-a-black/50 pointer-events-none" />
                  ) : (
                    <MdVisibility className="text-2xl text-a-black/50 pointer-events-none" />
                  )}
                </button>
              }
              variant="bordered"
              size="sm"
              classNames={inputClassNames}
            />
          </div>
          <div className="flex flex-col gap-y-2.5 w-[265px]">
            <p className="text-a-black/50 text-sm">Confirm password</p>
            <Input
              value={confirmPW}
              onValueChange={setConfirmPW}
              type={isConfirmPWVisible ? "text" : "password"}
              endContent={
                <button
                  className="focus:outline-none cursor-pointer"
                  type="button"
                  onClick={toggleConfirmPW}
                >
                  {isConfirmPWVisible ? (
                    <MdVisibilityOff className="text-2xl text-a-black/50 pointer-events-none" />
                  ) : (
                    <MdVisibility className="text-2xl text-a-black/50 pointer-events-none" />
                  )}
                </button>
              }
              variant="bordered"
              size="sm"
              classNames={inputClassNames}
            />
          </div>
        </div>
        <div className="flex flex-row justify-end gap-x-2.5">
          {/* TODO: Add in button to save edits / reset password */}
        </div>
      </div>
    </div>
  );
}
