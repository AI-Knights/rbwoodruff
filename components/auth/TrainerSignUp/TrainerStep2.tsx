"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trainerStep2Schema, type TrainerStep2 } from "@/validation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Clock, FileText } from "lucide-react";

interface TrainerStep2Props {
  onBack: () => void;
  onSubmit: (data: TrainerStep2) => void;
  defaultValues?: Partial<TrainerStep2>;
}

export default function TrainerSecond({
  onBack,
  onSubmit,
  defaultValues,
}: TrainerStep2Props) {
  const form = useForm<TrainerStep2>({
    resolver: zodResolver(trainerStep2Schema),
    defaultValues: defaultValues || {
      specialization: "",
      experience: "",
      skills: "",
      bio: "",
    },
  });

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Briefcase className="absolute left-0 top-3 h-5 w-5 text-gray-500" />
                    <Input
                      placeholder="Specialization"
                      className="border-0 outline-none pl-8 shadow-none  border-b  rounded-none  ring-0  focus:ring-0  focus:outline-none  focus:border-b  focus-visible:ring-0  focus-visible:outline-none"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute left-0 top-3 h-5 w-5 text-gray-500" />
                    <Input
                      placeholder="Years of experience"
                      className="border-0 outline-none pl-8 shadow-none  border-b  rounded-none  ring-0  focus:ring-0  focus:outline-none  focus:border-b  focus-visible:ring-0  focus-visible:outline-none"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute left-0 top-3 h-5 w-5 text-gray-500" />

                    <Input
                      placeholder="Add skills"
                      className="border-0 outline-none pl-8 shadow-none  border-b rounded-none   ring-0  focus:ring-0  focus:outline-none  focus:border-b  focus-visible:ring-0  focus-visible:outline-none"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <div className="flex flex-row gap-2 items-center py-2" >
                      <FileText className=" h-5 w-5 text-gray-500" />
                      <p>Short bio</p>
                    </div>
                    <Textarea
                      placeholder="Write about you..."
                      className="pl-10 min-h-24 resize-none border-b border-gray-300 rounded focus-visible:ring-0 focus:border-b-2 focus:border-[#6A0DAD]"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="flex-1 py-6 text-lg font-semibold"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#6A0DAD] hover:bg-[#5a0c9d] py-6 text-lg font-semibold"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
