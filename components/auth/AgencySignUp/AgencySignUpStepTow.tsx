"use client";
import { AgencyStep2, agencyStep2Schema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { MdDeleteOutline } from "react-icons/md";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Briefcase, Clock, Delete, File, FileText, Upload, X } from "lucide-react";

import { useForm } from "react-hook-form";

interface AgnecyStepTowTypes {
  onBack: () => void;
  onSubmit: (data: AgencyStep2) => void;
  defaultValues?: Partial<AgencyStep2>;
}

export default function AgencySignUpStepTow({
  onBack,
  onSubmit,
  defaultValues,
}: AgnecyStepTowTypes) {
  const form = useForm<AgencyStep2>({
    resolver: zodResolver(agencyStep2Schema),
    defaultValues: defaultValues || {
      agency_name: "",
      address: "",
      documents: [],
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    const currentFiles = form.getValues("documents") || [];
    const newFiles = [...currentFiles, ...acceptedFiles];
    form.setValue("documents", newFiles);
    form.trigger("documents");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    const files = form.getValues("documents") || [];
    const updated = files.filter((_, i) => i !== index);
    form.setValue("documents", updated);
    form.trigger("documents");
  };

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="agency_name"
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
            name="address"
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
            name="documents"
            render={() => (
              <FormItem>
                <FormControl>
                  <div>
                    <div className="flex flex-row items-center gap-2 opacity-60 py-2" >
                      <File></File>
                      <p>Submit documents</p>
                    </div>

                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                        isDragActive
                          ? "border-[#6A0DAD] bg-purple-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="mx-auto h-12 bg-gray-200 rounded-full  w-12 text-gray-500 p-3 mb-3" />
                      <p className="text-sm text-gray-600">
                        {isDragActive
                          ? "Drop PDF files here"
                          : "Tap / Drop to upload file"}
                      </p>
                   
                    </div>
                  </div>
                </FormControl>

                {form.watch("documents")?.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {form.watch("documents").map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded-md text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-600" />
                          <span className="truncate max-w-48">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 text-2xl cursor-pointer hover:text-red-700"
                        >
                          <MdDeleteOutline />

                        </button>
                      </div>
                    ))}
                  </div>
                )}

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
