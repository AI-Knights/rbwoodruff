"use client";

import { useState, useEffect, useRef } from "react";
import { redirect, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useVerifyEmailMutation } from "@/store/api/authSlice/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";


const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "Please enter all 6 digits" })
    .regex(/^\d+$/, { message: "Only numbers allowed" }),
});

type OTPFormValues = z.infer<typeof otpSchema>;

export default function VerificationPage() {

  const [verifyEmail] = useVerifyEmailMutation()
  const inputsRef = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const [resendTimer, setResendTimer] = useState(57);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const data = useSelector((state: RootState) => state.emailInfo.email)

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });


  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const otpValue = form.watch("otp") || "";
  const otpArray = otpValue.padEnd(6, "").split("").slice(0, 6);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = otpValue.split("");
    newOtp[index] = value;
    const cleaned = newOtp.join("").slice(0, 6);
    form.setValue("otp", cleaned, { shouldValidate: true });

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };


  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").trim();
    if (/^\d{1,6}$/.test(paste)) {
      const cleaned = paste.slice(0, 6);
      form.setValue("otp", cleaned, { shouldValidate: true });
      inputsRef.current[Math.min(cleaned.length, 5)]?.focus();
    }
    e.preventDefault();
  };


  const handleResend = () => {
    setResendTimer(57);
    setCanResend(false);
    form.reset({ otp: "" });
    inputsRef.current[0]?.focus();
    // TODO: API call to resend OTP
  };


  const onSubmit = async (values: OTPFormValues) => {
    try {
      const response = await verifyEmail({ email: data, otp: values.otp }).unwrap();
      console.log("OTP Verified:", response);
      router.push("/auth/sign-in");
    } catch (err: any) {
      // err.data contains server response
      form.setError("otp", {
        type: "server",
        message: err?.data?.non_field_errors?.[0] || "Invalid OTP",
      });
    }
    // redirect('/auth/welcome')
  };

  return (
    <div className="flex items-center  justify-center p-4">
      <div className="w-full md:max-w-3xl ">
        <div className=" border rounded-xl px-12 py-10 text-center">

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verification
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            We sent a 6-digit code to {data}

          </p>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-20">
              {/* OTP Field */}
              <FormField
                control={form.control}
                name="otp"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div
                        className="flex justify-between gap-2"
                        onPaste={handlePaste}
                      >
                        {[...Array(6)].map((_, index) => (
                          <Input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            className=" md:w-16 h-20 border-purple-800 border-2"
                            maxLength={1}
                            value={otpArray[index] || ""}
                            onChange={(e) =>
                              handleInputChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            ref={(el) => {
                              inputsRef.current[index] = el;
                            }}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-center mt-2" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={!form.formState.isValid}
                className="w-full h-12 bg-[#6A0DAD]  hover:bg-[#7812c0] text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign up
              </Button>
            </form>
          </Form>

          {/* Resend */}
          <div className="mt-16 text-sm text-gray-600">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-purple-600 hover:underline font-medium"
              >
                Resend code
              </button>
            ) : (
              <p>Resend code in {resendTimer}s</p>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}
