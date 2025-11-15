"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Company from "@/assets/company.svg";
import Loaction from "@/assets/loaction.svg";
import Lock from "@/assets/lock.svg";
import Email from "@/assets/email.svg";
import { email, z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { createNewPassworSchema } from "@/validation";
import { redirect } from "next/navigation";

export default function CreateNewPassword() {
  const form = useForm<z.infer<typeof createNewPassworSchema>>({
    resolver: zodResolver(createNewPassworSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  function onSubmit(values: z.infer<typeof createNewPassworSchema>) {
    console.log(values);
    redirect('/auth/welcome')
   
  }
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="border px-10 py-12 rounded-2xl mx-auto max-w-3xl w-full md:m-4 flex flex-col gap-4">
        <p className="text-center text-3xl font-bold">Create new password</p>
        <p className="text-center ">
          Your new password must be different <br /> from previously used
          passwords.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 md:space-y-12"
          >
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative flex flex-row gap-3 items-center border border-gray-300 p-1 rounded transition-colors">
                      <Image
                        src={Lock}
                        height={20}
                        width={20}
                        alt="company"
                        className="absolute left-6 pointer-events-none text-gray-500"
                      />

                      <Input
                        placeholder="New Password"
                        {...field}
                        className="border-0 outline-none pl-12 shadow-none  border-none rounded-none  ring-0  focus:ring-0  focus:outline-none  focus:border-b  focus-visible:ring-0  focus-visible:outline-none"
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative flex flex-row gap-3 items-center border border-gray-300 p-1 rounded transition-colors">
                      <Image
                        src={Lock}
                        height={20}
                        width={20}
                        alt="company"
                        className="absolute left-6 pointer-events-none text-gray-500"
                      />

                      <Input
                        className="border-0 outline-none  pl-12 shadow-none  border-none  rounded-none  ring-0  focus:ring-0  focus:outline-none  focus:border-b  focus-visible:ring-0  focus-visible:outline-none"
                        placeholder="Confirm Password"
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
              className="w-full bg-[#6A0DAD] py-6 cursor-pointer"
            >
              Reset password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
