"use client";

import { useState } from "react";

export default function Page() {
  const [isLogin, setIsLogin] = useState(true);
  const handleLogin = () => {
    setIsLogin(!isLogin);
  };

  const message = isLogin ? "Welcome back" : "Create an account";
  const button = isLogin ? "Login" : "Sign-up";
  const bottomAction = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  const bottomButton = isLogin ? "Sign-up" : "Login";

  function handleSubmit(formData) {
    if (isLogin) {
      const email = formData.get("email");
      const password = formData.get("password");
      alert(`Logging in with: ${email}, ${password}`);
    } else {
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      const confirmPassword = formData.get("confirmPassword");
      alert(
        `Registering with: ${name}, ${email}, ${password}, ${confirmPassword}`
      );
    }
  }

  return (
    // TODO: Make text unable to be highlighted
    <div className="w-screen h-screen p-16 bg-[#FCF0F250] flex flex-row justify-center">
      <div className="w-[400px] h-full p-10 rounded-[20px] border border-[#393E4610] bg-white flex flex-col justify-center items-center">
        <div className="flex flex-col gap-y-10">
          <p className="font-display font-bold text-2xl text-[#1F4776] text-center">
            NUS AEROBICS
          </p>
          <p className="font-poppins font-bold text-2xl text-[#393E46]">
            {message}
          </p>
        </div>
        <form action={handleSubmit}>
          <div className="py-10 flex flex-col">
            {!isLogin ? (
              <input
                className="w-full p-[10px] mb-5 rounded-[30px] border border-[#393E4650] font-poppins placeholder:text-[#393E4650]"
                name="name"
                placeholder="Name"
                required
              />
            ) : (
              <></>
            )}
            <input
              className="w-full p-[10px] rounded-[30px] border border-[#393E4650] font-poppins placeholder:text-[#393E4650]"
              name="email"
              type="email"
              placeholder="Email"
              required
            />
            <input
              className="w-full p-[10px] mt-5 rounded-[30px] border border-[#393E4650] font-poppins placeholder:text-[#393E4650]"
              name="password"
              type="password"
              placeholder="Password"
              required
            />
            {!isLogin ? (
              <input
                className="w-full p-[10px] mt-5 rounded-[30px] border border-[#393E4650] font-poppins placeholder:text-[#393E4650]"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                required
              />
            ) : (
              <></>
            )}
            {isLogin ? (
              <button className="mt-2.5 text-end text-[#1F4776] font-bold underline">
                Forgot password?
              </button>
            ) : (
              <></>
            )}
            <button
              type="submit"
              className="w-full mt-10 rounded-[30px] p-[10px] bg-[#1F4776] text-white"
            >
              {button}
            </button>
          </div>
        </form>
        <div className="flex flex-row gap-x-1">
          <p>{bottomAction}</p>
          <button
            className="text-end text-[#1F4776] font-bold underline"
            onClick={handleLogin}
          >
            {bottomButton}
          </button>
        </div>
      </div>
    </div>
  );
}
