"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@heroui/react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { inputClassNames } from "../utils/ClassNames";
import { useRouter } from "next/navigation";
import Toast from "../Toast";

export default function Page() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState({});

  async function handleLogin() {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      });
      if (!res.ok) {
        setEmail("");
        setPassword("");
        throw new Error("Incorrect email or password. Try again.");
      }
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      setEmail("");
      setPassword("");
      setToast({
        isSuccess: false,
        header: "Unable to login",
        message: `${ error.message }`,
      });
      setShowToast(true);
    }
  }

  async function handleSignUp() {
    try {
      if (isInvalidEmail || isInvalidName || isInvalidPW || isInvalidCPW) {
        throw new Error(`Invalid values used for sign-up. Try again.`);
      }

      const trimmedLowerEmail = email.trim().toLowerCase();
      const trimmedName = name.trim();

      if (trimmedLowerEmail === "" || trimmedName === "" || password === "" || confirmPassword === "") {
        throw new Error(`Please fill in all required fields.`);
      }

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: trimmedLowerEmail, password: password }),
      });
      if (!res.ok) {
        const response = await res.json();
        throw new Error(`${ response.error }`);
      }

      handleChangeView(view);
      setName("");
      setEmail(trimmedLowerEmail);
      setPassword("");
      setConfirmPassword("");

      setToast({
        isSuccess: true,
        header: "Successfully signed up",
        message: "Login with your newly created account.",
      });
      setShowToast(true);

    } catch (error) {
      console.log(error);
      setToast({
        isSuccess: false,
        header: "Unable to sign-up",
        message: `${ error.message }`,
      });
      setShowToast(true);
    }
  }

  async function handleForgotPassword() {
    try {
      const res = await fetch("/api/users/forgot-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });
      if (!res.ok) {
        const response = await res.json();
        throw new Error(`${ response.error }`);
      }

      setToast({
        isSuccess: true,
        header: "Requested password reset",
        message: `An email has been sent to ${ email } with instructions to reset your password.`,
      });
      setShowToast(true);
      handleChangeView(view);
      setEmail("");
    } catch (error) {
      console.log(error);
      setToast({
        isSuccess: false,
        header: "Unable to reset password",
        message: `${ error.message }`,
      });
      setShowToast(true);
    }
  }

  const [view, setView] = useState("login"); // login || signup || forgot
  const [message, setMessage] = useState("Welcome back"); // Welcome back || Create an account || Forgot password
  const [button, setButton] = useState("Login"); // Login || Sign-up || Continue

  const [bottomAction, setBottomAction] = useState("Don't have an account?"); // Don't have an account? || Already have an account? || Back to
  const [bottomButton, setBottomButton] = useState("Sign-up"); // Sign-up || Login || login

  const handleChangeView = (currentView) => {
    if (currentView === "login") {
      changeView("signup");
    } else {
      changeView("login");
    }
  };
  const changeView = (view) => {
    if (view === "login") {
      setMessage("Welcome back");
      setButton("Login");
      setBottomAction("Don't have an account?");
      setBottomButton("Sign-up");
    } else if (view === "signup") {
      setMessage("Create an account");
      setButton("Sign-up");
      setBottomAction("Already have an account?");
      setBottomButton("Login");
    } else if (view === "forgot") {
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
        return handleForgotPassword();
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
      }, 5000);
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

  const validateEmail = (value) => value.match(/^[A-Z0-9._%+-]+@(u\.nus\.edu|nus\.edu\.sg)$/i);
  const isInvalidEmail = useMemo(() => {
    if (email === "") return false;
    return !validateEmail(email);
  }, [email]);

  const validateName = (value) => value.match(/^[a-zA-Z ]+$/i);
  const isInvalidName = useMemo(() => {
    if (name === "") return false;
    return !validateName(name);
  }, [name]);

  const validatePW = (value) => value.length >= 5;
  const isInvalidPW = useMemo(() => {
    if (password === "") return false;
    return !validatePW(password);
  }, [password]);

  const isInvalidCPW = useMemo(() => {
    if (confirmPassword === "") return false;
    return confirmPassword !== password;
  }, [confirmPassword, password]);

  return (
    <>
      <div className="w-screen h-screen flex flex-row justify-center p-8 bg-a-pink/80">
        <div
          className="w-[400px] h-full flex flex-col overflow-y-scroll justify-center p-5 gap-y-5 rounded-[20px] border border-a-black/10 bg-white">
          <div className="w-full flex flex-col items-center gap-y-5">
            <img
              src="/images/logo.png"
              alt="NUS Aerobics"
              width="189"
              height="81"
              className="self-center"
            />
            <p className="font-poppins font-bold text-lg text-a-black">
              { message }
            </p>
          </div>
          <div className="w-full flex flex-col gap-y-2.5">
            { view === "signup" ? (
              <Input
                label="Full name"
                value={ name }
                onValueChange={ setName }
                isInvalid={ isInvalidName }
                errorMessage="Please enter a valid name"
                isRequired
                variant="bordered"
                size="sm"
                classNames={ inputClassNames }
              />
            ) : (
              <></>
            ) }
            <Input
              label="Email"
              value={ email }
              onValueChange={ setEmail }
              isInvalid={ view === "signup" && isInvalidEmail }
              errorMessage="Enter a valid NUS email (e.g., e1234567@u.nus.edu or yourname@nus.edu.sg)"
              isRequired
              variant="bordered"
              size="sm"
              classNames={ inputClassNames }
            />
            { view !== "forgot" ? (
              <Input
                label="Password"
                value={ password }
                onValueChange={ setPassword }
                type={ isPWVisible ? "text" : "password" }
                endContent={
                  <button
                    className="focus:outline-none cursor-pointer"
                    type="button"
                    onClick={ togglePWVisible }
                  >
                    { isPWVisible ? (
                      <MdVisibilityOff className="text-2xl text-a-black/50 pointer-events-none"/>
                    ) : (
                      <MdVisibility className="text-2xl text-a-black/50 pointer-events-none"/>
                    ) }
                  </button>
                }
                isInvalid={ view === "signup" && isInvalidPW }
                errorMessage="Password should be at least 5 characters"
                isRequired
                variant="bordered"
                size="sm"
                classNames={ inputClassNames }
              />
            ) : (
              <></>
            ) }
            { view === "signup" ? (
              <Input
                label="Confirm password"
                value={ confirmPassword }
                onValueChange={ setConfirmPassword }
                type={ isCPWVisible ? "text" : "password" }
                endContent={
                  <button
                    className="focus:outline-none cursor-pointer"
                    type="button"
                    onClick={ toggleCPWVisible }
                  >
                    { isCPWVisible ? (
                      <MdVisibilityOff className="text-2xl text-a-black/50 pointer-events-none"/>
                    ) : (
                      <MdVisibility className="text-2xl text-a-black/50 pointer-events-none"/>
                    ) }
                  </button>
                }
                isInvalid={ isInvalidCPW }
                errorMessage="Passwords do not match"
                isRequired
                variant="bordered"
                size="sm"
                classNames={ inputClassNames }
              />
            ) : (
              <></>
            ) }
            { view === "login" ? (
              <button
                className="text-end text-sm text-a-navy font-bold underline cursor-pointer"
                onClick={ () => changeView("forgot") }
              >
                Forgot password?
              </button>
            ) : (
              <></>
            ) }
          </div>

          <div className="w-full flex flex-col gap-y-2.5">
            { view === "signup" && (isInvalidName || isInvalidEmail || isInvalidPW || isInvalidCPW) ? (
              < button
                className="rounded-[30px] px-[20px] py-[10px] bg-[#1F477620] text-white text-sm cursor-not-allowed"
                disabled
              >
                { button }
              </button>
            ) : (
              <button
                className="rounded-[30px] px-[20px] py-[10px] bg-a-navy text-sm text-white cursor-pointer"
                onClick={ handleClick }
              >
                { button }
              </button>
            )
            }
            <div className="w-full flex flex-row justify-center gap-x-1">
              <p className="text-sm text-a-black bottom-action">
                { bottomAction }
              </p>
              <button
                className="text-end text-sm text-a-navy font-bold underline cursor-pointer bottom-button"
                onClick={ () => handleChangeView(view) }
              >
                { bottomButton }
              </button>
            </div>
          </div>
        </div>
      </div>
      { showToast ? (
        <div onClick={ toggleShowToast }>
          <Toast
            isSuccess={ toast.isSuccess }
            header={ toast.header }
            message={ toast.message }
          />
        </div>
      ) : (
        <></>
      ) }
    </>
  );
}
