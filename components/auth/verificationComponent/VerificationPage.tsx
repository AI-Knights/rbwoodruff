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
import { useSendOtpMutation, useVerifyEmailMutation } from "@/store/api/authSlice/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/error/error";
import { getErrorMessage } from "@/lib/globalError/error";


const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "Please enter all 6 digits" })
    .regex(/^\d+$/, { message: "Only numbers allowed" }),
});

type OTPFormValues = z.infer<typeof otpSchema>;

export default function VerificationPage() {
  const [sendOtp, { isLoading }] = useSendOtpMutation()
  const [verifyEmail, { isLoading: loading }] = useVerifyEmailMutation()
  const inputsRef = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const [resendTimer, setResendTimer] = useState(57);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const data = useSelector((state: RootState) => state.emailInfo)

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


  const handleResend = async () => {
    setResendTimer(57);
    setCanResend(false);
    form.reset({ otp: "" });
    inputsRef.current[0]?.focus();
    try {

      const response = await sendOtp({ email: data.email }).unwrap()
      toast.success(response.message)
    } catch (e) {
      const error = e as { data: ErrorResponse }
      toast.error(getErrorMessage(error.data))
    }
  };
  const step = 3;

  const onSubmit = async (values: OTPFormValues) => {
    try {
      const response = await verifyEmail({ email: data.email, otp: values.otp }).unwrap();
      console.log("OTP Verified:", response);
      const isForgotPage = data.route === "forogt-password" ? true : false
      router.push(isForgotPage ? "/auth/create-new-password" : "/auth/sign-in");
      toast.success(response.message)
    } catch (err: any) {
      const error = err as { data: ErrorResponse }
      const message = getErrorMessage(error.data)
      // err.data contains server response
      toast.error(message)
      console.log(message)
      form.setError("otp", {
        type: "server",
        message: message || "Invalid OTP",
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
          <p className="text-sm py-4 text-gray-600 ">
            We sent a 6-digit code to <span className="font-bold  mb-8 ">{data.email.slice(0, 3)}xxxxx.com</span>

          </p>

          {
            data.route == "employer" ? "" : <div className="flex justify-center items-center mb-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= 1 ? "bg-[#6A0DAD] text-white" : "bg-gray-300"
                  }`}
              >
                1
              </div>
              <div
                className={`w-16 h-1 transition-all ${step >= 2 ? "bg-[#6A0DAD]" : "bg-gray-300"
                  }`}
              ></div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step == 3 ? "bg-[#6A0DAD] text-white" : "bg-gray-300"
                  }`}
              >
                2
              </div>
              {/* <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step == 2 ? "bg-[#6A0DAD] text-white" : "bg-gray-300"
                }`}
            >
              2
            </div> */}
              <div
                className={`w-16 h-1 transition-all ${step == 3 ? "bg-[#6A0DAD]" : "bg-gray-300"
                  }`}
              ></div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step == 3 ? "bg-[#6A0DAD] text-white" : "bg-gray-300"
                  }`}
              >
                3
              </div>
            </div>
          }


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
                            className=" md:w-16 flex flex-row justify-center text-center items-center  font-semibold  h-20 border-purple-800 border-2"
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
                disabled={!form.formState.isValid || loading}
                className="w-full h-12 bg-[#6A0DAD]  hover:bg-[#7812c0] text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <div role="status">
                  <svg aria-hidden="true" className="w-4 h-4 text-neutral-tertiary animate-spin fill-brand" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div> : " Sign up"}
              </Button>
            </form>
          </Form>

          {/* Resend */}
          <div className="mt-16 text-sm text-gray-600">
            {canResend ? (
              <button
                disabled={isLoading}
                onClick={handleResend}
                className="text-purple-600 cursor-pointer  hover:underline font-medium"
              >
                {isLoading ? <div role="status">
                  <svg aria-hidden="true" className="w-4 h-4 text-neutral-tertiary animate-spin fill-brand" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div> : "Resend code"}
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
