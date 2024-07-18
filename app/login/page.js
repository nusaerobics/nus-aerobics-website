"use client";

import { useMemo, useState } from "react";
import { Input } from "@nextui-org/react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { inputClassNames } from "../components/ClassNames";
import { createUser } from "../services/DataService";

export default function Page() {
  const [isLogin, setIsLogin] = useState(true);
  const toggleLogin = () => {
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

  const PWEndContent = () => {
    return (
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
    );
  };
  const CPWEndContent = () => {
    return (
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
    );
  };

  const [isInvalidName, setIsInvalidName] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);

  // const isInvalidName = useMemo(() => {
  //   if (name != "") {
  //     // TODO: Allow space between
  //     const isValid = name.match(/^[a-zA-Z]+$/);
  //     return !isValid;
  //   } else {
  //     return false;
  //   }
  // });

  // const isInvalidPW = useMemo(() => {
  //   if (!isLogin && password != "") {
  //     const isLength = password.length >= 5;
  //     return !isLength;
  //   } else {
  //     return false;
  //   }
  // });

  // const isInvalidCPW = useMemo(() => {
  //   if (confirmPassword != "") {
  //     return !(password === confirmPassword);
  //   } else {
  //     return false;
  //   }
  // });

  // function validateName(name) {
  //   // const isValid = name.test(/^[a-zA-Z\s]+$/);
  //   setIsInvalidName(false);
  // }

  function validateEmail(email) {
    const isValid = email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
    setIsInvalidEmail(!isValid);
  }

  function validatePassword(password) {
    const isLength = password.length > 5;
    // TODO: Other validation for password strengths
    setIsInvalidEmail(!isLength);
  }

  function handleLogin() {
    validateEmail(email);
    validatePassword(password);

    console.log(`Email invalidity: ${isInvalidEmail}`);
    console.log(`Logging in with: ${email}, ${password}`);

    // TODO: Handle incorrect email/password
  }

  async function handleSignUp() {
    // validateName(name);
    validateEmail(email);
    validatePassword(password);
    validatePassword(confirmPassword);

    if (password != confirmPassword) {
      // TODO: Indicate CPW error message as not matching password
    }

    // TODO: Add bcrypt for passwords
    const newUser = {
      name: name,
      email: email,
      password: password,
    };
    const res = await createUser(newUser);
    console.log(res);
    console.log(
      `Signing up with: ${name}, ${email}, ${password}, ${confirmPassword}`
    );
  }

  return (
    // TODO: Make text unable to be highlighted
    <div className="w-screen h-screen flex flex-row justify-center p-8 bg-a-pink/80">
      <div className="w-[400px] flex flex-col justify-center overflow-scroll p-5 gap-y-5 rounded-[20px] border border-a-black/10 bg-white">
        <div className="w-full flex flex-col items-center gap-y-5">
          <p className="font-display font-bold text-2xl text-a-navy">
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
              // isInvalid={isInvalidName}
              // errorMessage="Please enter a valid name"
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
            // isInvalid={isInvalidEmail}
            // errorMessage="Please enter a valid email"
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
            endContent={PWEndContent}
            // isInvalid={isInvalidPW}
            // errorMessage="Password should be at least 5 characters"
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
              endContent={CPWEndContent}
              // isInvalid={isInvalidCPW}
              // errorMessage="Passwords do not match"
              isRequired
              variant="bordered"
              size="sm"
              classNames={inputClassNames}
            />
          ) : (
            <></>
          )}
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
            className="rounded-[30px] px-[20px] py-[10px] bg-[#1F4776] text-sm text-white"
            onClick={isLogin ? handleLogin : handleSignUp}
          >
            {button}
          </button>

          <div className="w-full flex flex-row justify-center gap-x-1">
            <p className="text-xs text-a-black">{bottomAction}</p>
            <button
              className="text-end text-xs text-a-navy font-bold underline"
              onClick={toggleLogin}
            >
              {bottomButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
