"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import OtpWithTimer from "@/components/auth/SignupForm/OtpWithTimer ";
import Link from "next/link";

const schema = z
  .object({
    phone: z.string().min(11, "شماره موبایل باید ۱۱ رقم باشد"),
    email: z.string().email("ایمیل معتبر نیست").optional().or(z.literal("")),
    password: z.string().min(6, "رمز عبور حداقل باید ۶ کاراکتر باشد"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "رمز عبور و تکرار آن یکسان نیستند",
    path: ["password_confirmation"],
  });

type FormData = z.infer<typeof schema>;

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [showRegesterInput, setShowRegesterInput] = useState(false);

  const [otpPhone, setOtpPhone] = useState("");
  console.log(otpPhone);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://nixfile.vanguard-store.ir/v2/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "ثبت‌نام ناموفق بود");
        return;
      }

      if (res.ok) {
        toast.success("ثبت‌نام با موفقیت انجام شد");
        return;
      }
    } catch (err) {
      const error = err as Error;
      toast.error(`${error.message}خطایی در اتصال به سرور رخ داد`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center h-screen">
      {!showRegesterInput && (
        <form className="md:w-[40%] sm:w-[80%] w-full bg-slate-300 items-center justify-center  rounded-2xl p-6 shadow-xl flex flex-col gap-4">
          <h2 className="text-xl font-bold text-center"> تایید شماره همراه</h2>

          <div className="flex w-full flex-col gap-1">
            <input
              type="text"
              value={otpPhone}
              onChange={(e) => setOtpPhone(e.target.value)}
              placeholder="شماره موبایل"
              className="p-3 rounded-xl w-full bg-slate-100"
            />
          </div>

          <div>
            <OtpWithTimer
              phone={otpPhone}
              onVerified={() => setShowRegesterInput(true)}
            />
          </div>
        </form>
      )}

      {showRegesterInput && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:w-[40%] sm:w-[80%] w-full bg-slate-300  rounded-2xl p-6 shadow-xl flex flex-col gap-4"
        >
          <h2 className="text-xl font-bold text-center">فرم ثبت‌نام</h2>

          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={otpPhone}
              readOnly
              {...register("phone")}
              placeholder="شماره موبایل"
              className="p-3 rounded-xl bg-slate-100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <input
              type="email"
              {...register("email")}
              placeholder="ایمیل (اختیاری)"
              className="p-3 rounded-xl bg-slate-100"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              type="password"
              {...register("password")}
              placeholder="رمز عبور"
              className="p-3 rounded-xl bg-slate-100"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              type="password"
              {...register("password_confirmation")}
              placeholder="تکرار رمز عبور"
              className="p-3 rounded-xl bg-slate-100"
            />
            {errors.password_confirmation && (
              <span className="text-red-500 text-sm">
                {errors.password_confirmation.message}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 justify-center">
            <Link className="text-blue-950 font-bold" href='/'> وارد شوید</Link>
            <p>حساب کاربری دارید؟</p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-950 w-[100%]"
          >
            {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default SignupForm;
