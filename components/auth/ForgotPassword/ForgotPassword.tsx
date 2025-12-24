"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import EmailIcon from "@/assets/email.svg";
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
import Image from "next/image";
import { forgotPassword } from "@/validation"; 
import { useRouter } from "next/navigation"; 
import { useForgotPasswordMutation } from "@/store/api/authSlice/authSlice";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/globalError/error";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setEmail } from "@/store/api/authSlice/emailSlice/emailSlice";
import { setToken, setTokenInCookies } from "@/lib/manage_token";

export default function ForgotPassword() {
  const [resetPassword] = useForgotPasswordMutation();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const form = useForm<z.infer<typeof forgotPassword>>({
    resolver: zodResolver(forgotPassword),
    mode: "onChange", 
    defaultValues: {
      email: "",
    },
  });

  const { isValid, isSubmitting } = form.formState; 

  async function onSubmit(values: z.infer<typeof forgotPassword>) {
    try {
      dispatch(setEmail({ email: values.email, route: "forogt-password" }));
      const res = await resetPassword(values).unwrap(); 
      toast.success(res?.message || "OTP sent successfully!");
      setToken({ token_name: "rest_token", reset_token: res.reset_token })
      
      router.push("/auth/verification");
    } catch (e: any) {
      const message = getErrorMessage(e?.data);
      toast.error(message || "Something went wrong");
    }
  }

  return (
    <div className="md:max-w-[702px] w-full p-4 border rounded-2xl md:px-14 py-8 flex flex-col gap-10 md:gap-14 mx-auto">
      <div className="flex flex-col text-center">
        <h1 className="text-center font-bold py-2 text-5xl">Forgot Password</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 md:space-y-12">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex flex-row gap-3 items-center border-b border-gray-300 transition-colors">
                    <Image
                      src={EmailIcon}
                      height={20}
                      width={20}
                      alt="email"
                      className="absolute left-0 pointer-events-none text-gray-500"
                    />
                    <Input
                      type="email"
                      placeholder="Company email"
                      className="border-0 outline-none pl-8 shadow-none rounded-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-b-2 focus:border-b-purple-600"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={!isValid || isSubmitting} 
            className="w-full bg-[#6A0DAD] hover:bg-[#7812c0] py-6 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send"}
          </Button>
        </form>
      </Form>
    </div>
  );
}