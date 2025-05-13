"use client";
import { Button } from "@/components/ui/button";
import { ExsistResponse } from "@/lib/types/Exsist";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Exists = () => {
  const [phonOrName, setPhonOrName] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handelExists = async (): Promise<ExsistResponse> => {
    setLoading(true);
    try {
      if (!phonOrName) {
        toast.error("مقدار صحیح نیست");
        return {
          message: "مقدار صحیح نیست",
          errors: {
            username: ["مقدار صحیح نیست"],
          },
        };
      }

      const res = await fetch(
        "https://nixfile.vanguard-store.ir/v2/auth/check-exists",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: phonOrName }),
        }
      );

      const result = await res.json();
      console.log(result);

      if (res.status === 422) {
        toast.error(result.message);
        return {
          message: "مقدار صحیح نیست",
          errors: result.errors || { username: [result.message] },
        };
      }

      if (res.status === 200) {
        toast.success("ورود موفقیت‌آمیز بود");
        router.push("/login-with-password");
      }

      return result as ExsistResponse;
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
      return {
        message: "مقدار صحیح نیست",
        errors: {
          username: [error.message],
        },
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center h-screen">
      <div className="w-[30%] bg-slate-300 shadow-2xl rounded-2xl p-4 flex flex-col items-center">
        <div className="flex flex-col gap-5 items-center justify-center">
          <h3 className="text-2xl font-bold">ورود با موبایل یا نام کاربری</h3>
          <div className="flex items-center gap-2">
            <Link href="/SignupForm" className="font-bold text-slate-950">
              ثبت نام کنید
            </Link>
            <p className="">حساب کاربری ندارید؟</p>
          </div>
        </div>
        <div className="flex w-full items-center justify-center flex-col gap-4">
          <input
            value={phonOrName}
            onChange={(e) => setPhonOrName(e.target.value)}
            type="text"
            className="bg-slate-400 shadow-xl my-3 rounded-2xl w-[80%] p-3"
            placeholder="نام کاربری یا شماره موبایل"
          />
          <Button
            onClick={handelExists}
            disabled={loading}
            className="bg-blue-950 w-[80%]"
          >
            {" "}
            {loading ? "در حال بررسی..." : "ادامه"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Exists;
