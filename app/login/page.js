"use client";

import { useMemo, useState } from "react";
import { Input } from "@nextui-org/react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { inputClassNames } from "../components/ClassNames";
import { useRouter } from "next/navigation";
import { z } from "zod";

export default function Page() {
  const router = useRouter();

  async function handleLogin() {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        console.log(res);
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.log(error);
      setEmail("");
      setPassword("");
    }
  }

  async function handleSignUp() {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, email: email, password: password }),
      });
      if (res.ok) {
        console.log("Created account successfully");
        setIsLogin(true);
        setName("");
        setEmail(email);
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const [isLogin, setIsLogin] = useState(true);
  const toggleIsLogin = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsLogin(!isLogin);
  };

  const message = isLogin ? "Welcome back" : "Create an account";
  const button = isLogin ? "Login" : "Sign-up";
  const bottomAction = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  const bottomButton = isLogin ? "Sign-up" : "Login";

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

  const validateEmail = (email) => {
    const emailSchema = z.string().email();
    try {
      emailSchema.parse(email);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const isInvalidEmail = useMemo(() => {
    if (email != "") {
      return !validateEmail(email);
    }
    return false;
  });

  const validateName = (name) => {
    const nameSchema = z.string().refine((str) => /^[a-zA-Z]+$/.test(str));
    try {
      nameSchema.parse(name);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const isInvalidName = useMemo(() => {
    if (name != "") {
      return !validateName(name);
    }
    return false;
  });

  const validatePW = (password) => {
    const PWSchema = z.string().min(5);
    try {
      PWSchema.parse(password);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const isInvalidPW = useMemo(() => {
    if (password != "") {
      return !validatePW(password);
    }
    return false;
  });
  const isInvalidCPW = useMemo(() => {
    if (confirmPassword != "") {
      return password != confirmPassword;
    }
    return false;
  });

  return (
    <div className="w-screen h-screen flex flex-row justify-center p-8 bg-a-pink/80">
      <div className="w-[400px] flex flex-col justify-center overflow-scroll p-5 gap-y-5 rounded-[20px] border border-a-black/10 bg-white">
        <div className="w-full flex flex-col items-center gap-y-5">
          <p className="font-display font-bold text-2xl text-a-navy text-center">
            NUS AEROBICS
          </p>
          <p className="font-poppins font-bold text-lg text-a-black">
            {message}
          </p>
        </div>
        <div className="w-full flex flex-col gap-y-1">
          {!isLogin ? (
            <Input
              label="Full name"
              value={name}
              onValueChange={setName}
              isInvalid={isInvalidName}
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
            isInvalid={isInvalidEmail}
            errorMessage="Please enter a valid email"
            isRequired
            variant="bordered"
            size="sm"
            classNames={inputClassNames}
          />
          <Input
            label="Password"
            value={password}
            onValueChange={setPassword}
            type={isPWVisible ? "text" : "password"}
            endContent={
              <button
                className="focus:outline-none"
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
            isInvalid={isInvalidPW}
            errorMessage="Password should be at least 5 characters"
            isRequired
            variant="bordered"
            size="sm"
            classNames={inputClassNames}
          />
          {!isLogin ? (
            <Input
              label="Confirm password"
              value={confirmPassword}
              onValueChange={setConfirmPassword}
              type={isCPWVisible ? "text" : "password"}
              endContent={
                <button
                  className="focus:outline-none"
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
              isInvalid={isInvalidCPW}
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
          {isLogin ? (
            <button className="text-end text-xs text-a-navy font-bold underline">
              Forgot password?
            </button>
          ) : (
            <></>
          )}
        </div>
        <div className="w-full flex flex-col gap-y-1">
          <button
            className="rounded-[30px] px-[20px] py-[10px] bg-a-navy text-sm text-white"
            onClick={isLogin ? handleLogin : handleSignUp}
          >
            {button}
          </button>

          <div className="w-full flex flex-row justify-center gap-x-1">
            <p className="text-xs text-a-black">{bottomAction}</p>
            <button
              className="text-end text-xs text-a-navy font-bold underline"
              onClick={toggleIsLogin}
            >
              {bottomButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
