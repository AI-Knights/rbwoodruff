"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Company from "@/assets/company.svg";
import Loaction from "@/assets/loaction.svg";
import Lock from "@/assets/lock.svg";
import Email from "@/assets/email.svg";
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
import { formSchema } from "@/validation";
import { useRouter } from "next/navigation";
import { useCreateAccountMutation } from "@/store/api/authSlice/authSlice";
import { useDispatch } from "react-redux";
import { setEmail } from "@/store/api/authSlice/emailSlice/emailSlice";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { ErrorResponse } from "@/types/error/error";
import { getErrorMessage } from "@/lib/globalError/error";
import { toast } from "sonner";

export default function EmployeSignUp() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [createAccount, { isLoading }] = useCreateAccountMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      email: "",
      office_location: "",
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await createAccount({
        user_type: "employer",
        email: values.email,
        full_name: values.company_name,
        password: values.password,
        data: {
          company_name: values.company_name,
          office_location: values.office_location,
        },
      }).unwrap();

      toast.success(res.message)
      dispatch(setEmail({email :values.email , route : "employer"}));
      router.push("/auth/verification");
    } catch (e) {
      const error = e as { data: ErrorResponse }
      const message = getErrorMessage(error.data)
      toast.error(getErrorMessage(error.data))
      form.setError("root", {
        message: getErrorMessage(error.data) || "Invalid",
      });
    }
  }

  return (
    <div className="md:max-w-[702px] w-full p-4 border rounded-2xl md:px-14 py-8 flex flex-col gap-10 md:gap-14 mx-auto">
      <h1 className="text-center font-bold py-2 text-5xl">Sign Up</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 md:space-y-12"
        >
          {/* Company Name */}
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex items-center border-b border-gray-300">
                    <Image
                      src={Company}
                      height={20}
                      width={20}
                      alt="company"
                      className="absolute left-0 pointer-events-none text-gray-500"
                    />
                    <Input
                      placeholder="Company name"
                      {...field}
                      className="border-0 pl-8 shadow-none rounded-none focus:ring-0"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex items-center border-b border-gray-300">
                    <Image
                      src={Email}
                      height={20}
                      width={20}
                      alt="email"
                      className="absolute left-0 pointer-events-none text-gray-500"
                    />
                    <Input
                      placeholder="Company email"
                      {...field}
                      className="border-0 pl-8 shadow-none rounded-none focus:ring-0"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Office Location */}
          <FormField
            control={form.control}
            name="office_location"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex items-center border-b border-gray-300">
                    <Image
                      src={Loaction}
                      height={20}
                      width={20}
                      alt="location"
                      className="absolute left-0 pointer-events-none text-gray-500"
                    />
                    <Input
                      placeholder="Office location"
                      {...field}
                      className="border-0 pl-8 shadow-none rounded-none focus:ring-0"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex items-center border-b border-gray-300">
                    <Image
                      src={Lock}
                      height={20}
                      width={20}
                      alt="password"
                      className="absolute left-0 pointer-events-none text-gray-500"
                    />

                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                      className="border-0 pl-8 pr-8 shadow-none rounded-none focus:ring-0"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-0 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex items-center border-b border-gray-300">
                    <Image
                      src={Lock}
                      height={20}
                      width={20}
                      alt="confirm-password"
                      className="absolute left-0 pointer-events-none text-gray-500"
                    />

                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      {...field}
                      className="border-0 pl-8 pr-8 shadow-none rounded-none focus:ring-0"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((p) => !p)
                      }
                      className="absolute right-0 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-[#6A0DAD] py-6 cursor-pointer"
          >
            {isLoading ? "Account Creating..." : "Sign up"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
