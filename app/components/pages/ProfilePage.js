"use client";

import clsx from "clsx";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Input } from "@nextui-org/react";
import { PageTitle, SectionTitle } from "../utils/Titles";
import { inputClassNames } from "../utils/ClassNames";
import Toast from "../Toast";

export default function ProfilePage({ session }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPW, setCurrentPW] = useState("");
  const [newPW, setNewPW] = useState("");
  const [confirmPW, setConfirmPW] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState({});

  const [isCurrentPWVisible, setIsCurrentPWVisible] = useState(false);
  const [isNewPWVisible, setIsNewPWVisible] = useState(false);
  const [isConfirmPWVisible, setIsConfirmPWVisible] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [isReset, setIsReset] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users?id=${session.userId}`);
        if (!res.ok) {
          throw new Error(
            `Unable to get user ${session.userId}: ${res.status}`
          );
        }
        const data = await res.json();
        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const toggleCurrentPW = () => {
    setIsCurrentPWVisible(!isCurrentPWVisible);
  };
  const toggleNewPW = () => {
    setIsNewPWVisible(!isNewPWVisible);
  };
  const toggleConfirmPW = () => {
    setIsConfirmPWVisible(!isConfirmPWVisible);
  };
  const toggleIsEdit = () => {
    setIsEdit(!isEdit);
  };
  const toggleIsReset = () => {
    setIsReset(!isReset);
  };
  const toggleShowToast = () => {
    setShowToast(!showToast);
  };

  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  async function saveEdit() {
    try {
      const updatedUser = { id: session.userId, name: name, email: email };
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (!res.ok) {
        throw new Error(`Unable to update user ${session.userId}.`);
      }
      toggleIsEdit();
      setToast({
        isSuccess: true,
        header: "Updated profile",
        message: `Successfully updated profile.`,
      });
      setShowToast(true);
    } catch (error) {
      setToast({
        isSuccess: false,
        header: "Unable to update profile",
        message: `Unable to update profile. Try again later.`,
      });
      setShowToast(true);
      console.log(error);
    }
  }

  async function resetPassword() {
    try {
      if (newPW != confirmPW) {
        setToast({
          isSuccess: false,
          header: "Unable to reset password",
          message: `Passwords do not match. Try again.`,
        });
        setShowToast(true);
        return;
      }
      const updatedUser = {
        id: session.userId,
        newPassword: confirmPW,
        currentPassword: currentPW,
      };
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (!res.ok) {
        throw new Error(`Unable to reset password for user ${session.userId}.`);
      }
      toggleIsReset();
      setCurrentPW("");
      setNewPW("");
      setConfirmPW("");
      setToast({
        isSuccess: true,
        header: "Changed password",
        message: `Successfully changed password.`,
      });
      setShowToast(true);
    } catch (error) {
      setToast({
        isSuccess: false,
        header: "Unable to reset password",
        message: `Unable to reset password. Try again later.`,
      });
      setShowToast(true);
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-5 p-10 pt-20 overflow-y-scroll">
        <PageTitle title="Profile" />
        <div className="h-1/2 flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
          <div className="flex flex-row justify-between items-center gap-x-2.5">
            <SectionTitle title="User details" />
            <div className="flex flex-row gap-x-2.5">
              {isEdit ? (
                <button
                  onClick={toggleIsEdit}
                  className="h-[36px] rounded-[30px] px-[20px] bg-a-navy/10 text-a-navy text-sm cursor-pointer"
                >
                  Cancel
                </button>
              ) : (
                <></>
              )}
              <button
                onClick={isEdit ? saveEdit : toggleIsEdit}
                disabled={isReset}
                className={clsx("h-[36px] rounded-[30px] px-[20px] text-sm", {
                  "bg-a-navy text-white cursor-pointer": !isReset,
                  "bg-a-navy/20 text-white cursor-not-allowed": isReset,
                })}
              >
                {isEdit ? "Save changes" : "Edit user"}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-y-2.5 w-[265px]">
            <p className="text-a-black/50 text-sm">Full name</p>
            <Input
              value={name}
              onValueChange={setName}
              isDisabled={!isEdit}
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
                  isDisabled={!isEdit}
                  variant="bordered"
                  size="xs"
                  classNames={inputClassNames}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-1/2 flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
          <div className="flex flex-row justify-between items-center gap-x-2.5">
            <SectionTitle title="Change password" />
            <div className="flex flex-row gap-x-2.5">
              {isReset ? (
                <button
                  onClick={toggleIsReset}
                  className="h-[36px] rounded-[30px] px-[20px] bg-a-navy/10 text-a-navy text-sm cursor-pointer"
                >
                  Cancel
                </button>
              ) : (
                <></>
              )}
              <button
                onClick={isReset ? resetPassword : toggleIsReset}
                disabled={isEdit}
                className={clsx("h-[36px] rounded-[30px] px-[20px] text-sm", {
                  "bg-a-navy text-white cursor-pointer": !isEdit,
                  "bg-a-navy/20 text-white cursor-not-allowed": isEdit,
                })}
              >
                {isReset ? "Save changes" : "Reset password"}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-y-2.5 w-[265px]">
            <p className="text-a-black/50 text-sm">Current password</p>
            <Input
              value={currentPW}
              onValueChange={setCurrentPW}
              isDisabled={!isReset}
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
                isDisabled={!isReset}
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
                isDisabled={!isReset}
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
        </div>
      </div>
      {showToast ? (
        <div onClick={toggleShowToast}>
          <Toast
            isSuccess={toast.isSuccess}
            header={toast.header}
            message={toast.message}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

ProfilePage.propTypes = {
  session: PropTypes.object,
};
