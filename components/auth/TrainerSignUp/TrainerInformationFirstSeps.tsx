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
import { TrainerStep1, trainerStep1Schema } from "@/validation";
import { User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface TrainerStep1Props {
  onNext: (data: TrainerStep1) => void;
  defaultValues?: Partial<TrainerStep1>;
}

export default function TrainerInformationFirstSeps({
  onNext,
  defaultValues,
}: TrainerStep1Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<TrainerStep1>({
    resolver: zodResolver(trainerStep1Schema),
    defaultValues: defaultValues || {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = (data: TrainerStep1) => {
    onNext(data);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 md:space-y-12"
        >
          {/* Full Name */}
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex flex-row gap-3 items-center border-b border-gray-300 transition-colors">
                    <div className="absolute left-0 pointer-events-none text-gray-500">
                      <User />
                    </div>
                    <Input
                      placeholder="Full Name"
                      {...field}
                      className="border-0 outline-none pl-8 shadow-none border-b rounded-none ring-0 focus:ring-0 focus:outline-none focus:border-b focus-visible:ring-0 focus-visible:outline-none"
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
                  <div className="relative flex flex-row gap-3 items-center border-b border-gray-300 transition-colors">
                    <Image
                      src={Email}
                      height={20}
                      width={20}
                      alt="Email"
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

          {/* Password */}
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
                  <div className="relative flex flex-row gap-3 items-center border-b border-gray-300 transition-colors">
                    <Image
                      src={Lock}
                      height={20}
                      width={20}
                      alt="confirm-password"
                      className="absolute left-0 pointer-events-none text-gray-500"
                    />

                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      className="border-0 pl-8 pr-8 outline-none shadow-none border-b rounded-none ring-0 focus:ring-0 focus:outline-none focus:border-b focus-visible:ring-0 focus-visible:outline-none"
                      placeholder="Confirm Password"
                      {...field}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((prev) => !prev)
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
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
}
