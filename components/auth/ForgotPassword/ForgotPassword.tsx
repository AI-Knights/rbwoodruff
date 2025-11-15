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
import { forgotPassword, formSchema } from "@/validation";
import { redirect } from "next/navigation";

export default function ForgotPassword() {
  const form = useForm<z.infer<typeof forgotPassword>>({
    resolver: zodResolver(forgotPassword),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof forgotPassword>) {
    console.log(values);
    redirect("/auth/verification");
  }
  return (
    <div className="md:max-w-[702px] w-full p-4 border rounded-2xl md:px-14 py-8 flex flex-col gap-10 md:gap-14 mx-auto">
      <div className="flex flex-col text-center">
        <h1 className="text-center font-bold py-2 text-5xl">Forgot Password</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 md:space-y-12"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex flex-row gap-3 items-center border-b border-gray-300  transition-colors">
                    <Image
                      src={Email}
                      height={20}
                      width={20}
                      alt="company"
                      className="absolute left-0 pointer-events-none text-gray-500"
                    />

                    <Input
                      className="border-0 outline-none  pl-8 shadow-none  border-b  rounded-none  ring-0  focus:ring-0  focus:outline-none  focus:border-b  focus-visible:ring-0  focus-visible:outline-none"
                      placeholder="Company email"
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
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
}
