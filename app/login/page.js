"use client";

import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { inputClassNames } from "../components/utils/ClassNames";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Toast from "../components/Toast";

export default function Page() {
  const router = useRouter();
  const [isSubmit, setIsSubmit] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState({});

  async function handleLogin() {
    try {
      setIsSubmit(true);
      validateEmail();

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (res.status == 400) {
        setEmail("");
        setPassword("");
        setToast({
          isSuccess: false,
          header: "Unable to login",
          message: "Incorrect email or password. Try again.",
        });
        setShowToast(true);
        return;
      }

      router.push("/dashboard");
      setIsSubmit(false);
    } catch (error) {
      setEmail("");
      setPassword("");
      setToast({
        isSuccess: false,
        header: "Unable to login",
        message: `An error occurred while logging in. Try again later.`,
      });
      setShowToast(true);
      console.log(error);
    }
  }

  async function handleSignUp() {
    try {
      setIsSubmit(true);
      validateEmail();
      validateName();
      validatePW();
      validateCPW();

      console.log(isInvalidEmail, isInvalidName, isInvalidPW, isInvalidCPW);
      if (isInvalidEmail || isInvalidName || isInvalidPW || isInvalidCPW) {
        throw new Error(`Invalid values used for sign-up, unable to sign-up.`);
      }

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, email: email, password: password }),
      });

      if (!res.ok) {
        throw new Error(`Unable to sign-up: ${res.json}.`);
      }
      setIsLogin(true);
      setName("");
      setEmail(email);
      setPassword("");
      setConfirmPassword("");
      setIsSubmit(false);
    } catch (error) {
      console.log(error);
    }
  }

  // async function handleForgotPassword() {
  //   try {
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const [view, setView] = useState("login");              // login || signup || forgot
  const [message, setMessage] = useState("Welcome back"); // Welcome back || Create an account || Forgot password
  const [button, setButton] = useState("Login");          // Login || Sign-up || Continue

  const [bottomAction, setBottomAction] = useState("Don't have an account?"); // Don't have an account? || Already have an account? || Back to
  const [bottomButton, setBottomButton] = useState("Sign-up");                // Sign-up || Login || login

  const handleChangeView = (currentView) => {
    if (currentView == "login") {
      changeView("signup");
    } else {
      changeView("login");
    }
  };
  const changeView = (view) => {
    if (view == "login") {
      setMessage("Welcome back");
      setButton("Login");
      setBottomAction("Don't have an account?");
      setBottomButton("Sign-up");
    } else if (view == "signup") {
      setMessage("Create an account");
      setButton("Sign-up");
      setBottomAction("Already have an account?");
      setBottomButton("Login");
    } else if (view == "forgot") {
      setMessage("Forgot password");
      setButton("Continue");
      setBottomAction("Back to");
      setBottomButton("login");
    }
    setView(view);
  };
  const handleClick = () => {
    switch (view) {
      case "login":
        return handleLogin();
      case "signup":
        return handleSignUp();
      case "forgot":
        return;
    }
  };

  const toggleShowToast = () => {
    setShowToast(!showToast);
  };

  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPWVisible, setIsPWVisible] = useState(false);
  const [isCPWVisible, setIsCPWVisible] = useState(false);

  const togglePWVisible = () => {
    setIsPWVisible(!isPWVisible);
  };
  const toggleCPWVisible = () => {
    setIsCPWVisible(!isCPWVisible);
  };

  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidName, setIsInvalidName] = useState(false);
  const [isInvalidPW, setIsInvalidPW] = useState(false);
  const [isInvalidCPW, setIsInvalidCPW] = useState(false);

  const validateEmail = () => {
    const emailSchema = z.string().email();
    try {
      emailSchema.parse(email);
      setIsInvalidEmail(false);
    } catch (error) {
      setIsInvalidEmail(true);
      console.log(error);
    }
  };
  const validateName = () => {
    const nameSchema = z.string().refine((str) => /^[a-zA-Z ]+$/.test(str));
    try {
      nameSchema.parse(name);
      setIsInvalidName(false);
    } catch (error) {
      console.log(error);
      setIsInvalidName(true);
    }
  };
  const validatePW = () => {
    const PWSchema = z.string().min(5);
    try {
      PWSchema.parse(password);
      setIsInvalidPW(false);
    } catch (error) {
      console.log(error);
      setIsInvalidPW(true);
    }
  };
  const validateCPW = () => {
    setIsInvalidCPW(password != confirmPassword);
  };

  return (
    <>
      <div className="w-screen h-screen flex flex-row justify-center p-8 bg-a-pink/80">
        <div className="w-[400px] h-full flex flex-col overflow-y-scroll justify-center p-5 gap-y-5 rounded-[20px] border border-a-black/10 bg-white">
          <div className="w-full flex flex-col items-center gap-y-5">
            <img
              src="/images/logo.png"
              alt="NUS Aerobics"
              width="189"
              height="81"
              className="self-center"
            />
            <p className="font-poppins font-bold text-lg text-a-black">
              {message}
            </p>
          </div>
          <div className="w-full flex flex-col gap-y-2.5">
            {view == "signup" ? (
              <Input
                label="Full name"
                value={name}
                onValueChange={setName}
                isInvalid={isSubmit && isInvalidName}
                errorMessage="Please enter a valid name"
                isRequired
                variant="bordered"
                size="sm"
                classNames={inputClassNames}
              />
            ) : (
              <></>
            )}
            <Input
              label="Email"
              value={email}
              onValueChange={setEmail}
              isInvalid={isSubmit && isInvalidEmail}
              errorMessage="Please enter a valid email"
              isRequired
              variant="bordered"
              size="sm"
              classNames={inputClassNames}
            />
            {view != "forgot" ? (
              <Input
                label="Password"
                value={password}
                onValueChange={setPassword}
                type={isPWVisible ? "text" : "password"}
                endContent={
                  <button
                    className="focus:outline-none cursor-pointer"
                    type="button"
                    onClick={togglePWVisible}
                  >
                    {isPWVisible ? (
                      <MdVisibilityOff className="text-2xl text-a-black/50 pointer-events-none" />
                    ) : (
                      <MdVisibility className="text-2xl text-a-black/50 pointer-events-none" />
                    )}
                  </button>
                }
                isInvalid={view != "login" && isSubmit && isInvalidPW}
                errorMessage="Password should be at least 5 characters"
                isRequired
                variant="bordered"
                size="sm"
                classNames={inputClassNames}
              />
            ) : (
              <></>
            )}
            {view == "signup" ? (
              <Input
                label="Confirm password"
                value={confirmPassword}
                onValueChange={setConfirmPassword}
                type={isCPWVisible ? "text" : "password"}
                endContent={
                  <button
                    className="focus:outline-none cursor-pointer"
                    type="button"
                    onClick={toggleCPWVisible}
                  >
                    {isCPWVisible ? (
                      <MdVisibilityOff className="text-2xl text-a-black/50 pointer-events-none" />
                    ) : (
                      <MdVisibility className="text-2xl text-a-black/50 pointer-events-none" />
                    )}
                  </button>
                }
                isInvalid={isSubmit && isInvalidCPW}
                errorMessage="Passwords do not match"
                isRequired
                variant="bordered"
                size="sm"
                classNames={inputClassNames}
              />
            ) : (
              <></>
            )}
            {/* TODO: Implement handling forgot password */}
            {view == "login" ? (
              <button
                className="text-end text-sm text-a-navy font-bold underline cursor-pointer"
                onClick={() => changeView("forgot")}
              >
                Forgot password?
              </button>
            ) : (
              <></>
            )}
          </div>

          <div className="w-full flex flex-col gap-y-2.5">
            <button
              className="rounded-[30px] px-[20px] py-[10px] bg-a-navy text-sm text-white cursor-pointer"
              onClick={handleClick}
            >
              {button}
            </button>
            <div className="w-full flex flex-row justify-center gap-x-1">
              <p className="text-sm text-a-black bottom-action">
                {bottomAction}
              </p>
              <button
                className="text-end text-sm text-a-navy font-bold underline cursor-pointer bottom-button"
                onClick={() => handleChangeView(view)}
              >
                {bottomButton}
              </button>
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
