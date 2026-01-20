"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Lock from "@/assets/lock.svg";
import Email from "@/assets/email.svg";

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
import { signIn } from "@/validation";
import Link from "next/link";
import z from "zod";
import { useSignInUserMutation } from "@/store/api/authSlice/authSlice";
import { useRouter } from "next/navigation";
import { getDashboardRoute } from "@/lib/manage_token/decode_token";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { ErrorResponse } from "@/types/error/error";
import { getErrorMessage } from "@/lib/globalError/error";
import { toast } from "sonner";

export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [signInUser, { isLoading }] = useSignInUserMutation();

  const form = useForm<z.infer<typeof signIn>>({
    resolver: zodResolver(signIn),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signIn>) {
    try {
      const response = await signInUser({
        email: values.email,
        password: values.password,
      }).unwrap();

      // Give a small delay to ensure cookies are fully written
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify token is readable
      const path = getDashboardRoute(response.access);
      
      if (!path || path === '#') {
        console.error('[SignIn] Failed to get dashboard route from token');
        toast.error('Login failed - invalid token');
        return;
      }

      toast.success("sign-in successfull", {
        position: "bottom-center"
      });
      
      // Use replace instead of push to prevent back button issues
      router.replace(path);
    } catch (error: unknown) {
      const err = error as { data: ErrorResponse }
      const message = getErrorMessage(err.data)
      console.error('[SignIn] Login error:', message)
      toast.error(message)
      form.setError("root", {
        message: getErrorMessage(err.data) || "Invalid email or password",
      });
    }
  }

  return (
    <div>
      <div className="md:max-w-[702px] w-full p-4 border rounded-2xl md:px-14 py-8 flex flex-col gap-10 md:gap-14 mx-auto">
        <h1 className="text-center font-bold py-2 text-5xl">Sign In</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 md:space-y-12"
          >
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative flex flex-row gap-3 items-center border-b border-gray-300 transition-colors">
                      <Image
                        src={Email}
                        height={20}
                        width={20}
                        alt="email"
                        className="absolute left-0 pointer-events-none text-gray-500"
                      />
                      <Input
                        className="border-0 outline-none pl-8 shadow-none border-b rounded-none ring-0 focus:ring-0 focus:outline-none focus:border-b focus-visible:ring-0 focus-visible:outline-none"
                        placeholder="Email"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password with Eye Icon */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative flex flex-row gap-3 items-center border-b border-gray-300 transition-colors">
                      <Image
                        src={Lock}
                        height={20}
                        width={20}
                        alt="password"
                        className="absolute left-0 pointer-events-none text-gray-500"
                      />

                      <Input
                        type={showPassword ? "text" : "password"}
                        className="border-0 pl-8 pr-8 outline-none shadow-none border-b rounded-none ring-0 focus:ring-0 focus:outline-none focus:border-b focus-visible:ring-0 focus-visible:outline-none"
                        placeholder="Password"
                        {...field}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-0 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
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
              disabled={isLoading}
              className="w-full bg-[#6A0DAD] py-6 cursor-pointer"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>

        <Link href="/auth/forgot-password" className="text-center">
          Forgot password?
        </Link>
      </div>

      <div className="text-center py-5 md:py-10">
        Don’t have an account?{" "}
        <Link className="font-bold" href="/auth">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
