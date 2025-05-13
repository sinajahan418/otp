"use client";

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const LoginWithOtp = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (!username) {
        toast.error("همه فیلدها الزامی هستند");
        return;
      }

      const res = await fetch(
        "https://nixfile.vanguard-store.ir/v2/auth/login-via-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
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
      <div className="md:w-[40%] sm:w-[80%] w-full bg-slate-300 shadow-2xl rounded-2xl p-4 flex flex-col items-center">
        <div className="flex flex-col gap-5 items-center justify-center">
          <h3 className="text-2xl font-bold">ورود با رمز یکبار مصرف</h3>
          <p className="text-sm text-gray-800">
            لطفاً نام کاربری یا تلفن خود را وارد کنید
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
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="bg-blue-950 w-[80%]"
          >
            {loading ? "در حال ارسال کد..." : "ارسال کد"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginWithOtp;
