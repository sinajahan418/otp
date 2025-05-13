"use client";

import { useEffect, useState } from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const OtpWithTimer = ({
  phone,
  onVerified,
}: {
  phone: string;
  onVerified: () => void;
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(0); 

  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    if (timer > 0) return; 

    setLoading(true);
    try {
      const res = await fetch(
        "https://nixfile.vanguard-store.ir/v2/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: phone }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "ارسال کد با خطا مواجه شد");
        return;
      }

      toast.success("کد تایید ارسال شد");
      setIsOtpSent(true);
      setTimer(60); 
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("کد تایید باید ۶ رقمی باشد");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://nixfile.vanguard-store.ir/v2/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: phone, code: otp }),
        }
      );

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "تایید کد ناموفق بود");
        return;
      }

      toast.success("کد تایید شد");
      onVerified(); 
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <Button
        disabled={loading || timer > 0}
        onClick={handleSendOtp}
        className="bg-blue-900 w-full"
      >
        {timer > 0 ? `ارسال مجدد (${timer})` : loading ? "در حال ارسال..." : "دریافت کد تایید"}
      </Button>

      {isOtpSent && (
        <>
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            value={otp}
            onChange={setOtp}
          >
            <InputOTPGroup className="bg-slate-400 rounded-2xl">
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <Button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="bg-green-800 w-full"
          >
            {loading ? "در حال تایید..." : "تایید کد"}
          </Button>
        </>
      )}
    </div>
  );
};

export default OtpWithTimer;
