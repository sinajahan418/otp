"use client";

import { Button } from "@/components/ui/button";
import { usePhoneStore } from "@/lib/store/phoneStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import OtpWithTimer from "../SignupForm/OtpWithTimer ";

const LoginWithPassword = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginWithOtp, setLoginWithOtp] = useState(false);
  const { userName, setUserName } = usePhoneStore();
  console.log(userName);

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (!password) {
        toast.error("همه فیلدها الزامی هستند");
        return;
      }
      const userData = {
        username: username ? username : userName,
        password,
      };
      const res = await fetch(
        "https://nixfile.vanguard-store.ir/v2/auth/login-via-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const result = await res.json();
      console.log(result);

      if (!res.ok) {
        toast.error(result.message || "ورود ناموفق بود");
        return;
      }
      if (res.ok) {
        toast.success("ورود موفقیت‌آمیز بود");
        router.push("/");
        return;
      }
    } catch (err) {
      const error = err as Error;
      toast.error(` ${error.message}خطایی رخ داده`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center h-screen">
      {!loginWithOtp && (
        <div className="md:w-[40%] sm:w-[80%] w-full bg-slate-300 shadow-2xl rounded-2xl p-4 flex flex-col items-center">
          <div className="flex flex-col gap-5 items-center justify-center">
            <h3 className="text-2xl font-bold">ورود با رمز عبور</h3>
            <p className="text-sm text-gray-800">
              لطفاً رمز عبور خود را وارد کنید
            </p>
          </div>
          <div className="flex w-full items-center justify-center flex-col gap-4 mt-4">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className="bg-slate-400 shadow-xl rounded-2xl w-[80%] p-3"
              placeholder="نام کاربری یا موبایل"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="bg-slate-400 shadow-xl rounded-2xl w-[80%] p-3"
              placeholder="رمز عبور"
            />
            <p
              onClick={() => setLoginWithOtp(true)}
              className=" cursor-pointer font-bold py-3"
            >
              ورود با کد یکبار مصرف
            </p>
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="bg-blue-950 w-[80%]"
            >
              {loading ? "در حال ورود..." : "ورود"}
            </Button>
          </div>
        </div>
      )}
      {loginWithOtp && (
        <form className="md:w-[40%] sm:w-[80%] w-full bg-slate-300 items-center justify-center  rounded-2xl p-6 shadow-xl flex flex-col gap-4">
          <h2 className="text-xl font-bold text-center">
            ورود با کد یکبار مصرف
          </h2>

          <div className="flex w-full flex-col gap-1">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="شماره موبایل"
              className="p-3 rounded-xl w-full bg-slate-100"
            />
          </div>

          <div>
            <OtpWithTimer
              phone={userName}
              onVerified={() => router.push("/")}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginWithPassword;
