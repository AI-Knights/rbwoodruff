"use client";
import { AgencySignUpFinal, AgencyStep2, agencyStep2Schema, CloudinaryDocument } from "@/validation";
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
import { Briefcase, Clock, Upload, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { uploadToCloudinary } from "@/lib/upload_images/upload";


interface AgencyStepTowTypes {
  onBack: () => void;
  onSubmit: (data: AgencySignUpFinal) => void;
  defaultValues?: Partial<AgencyStep2>;
}

export default function AgencySignUpStepTow({
  onBack,
  onSubmit,
  defaultValues,
}: AgencyStepTowTypes) {
  const [uploading, setUploading] = useState(false);

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

  const handleSubmit = async (data: AgencyStep2) => {
    if (!data.documents?.length) {
      form.setError("documents", { message: "At least one document is required" });
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = data.documents.map((file) => uploadToCloudinary(file));
      const urls: CloudinaryDocument[] = await Promise.all(uploadPromises);

      const finalData = {
        ...data,
        documents: urls,
      };
      console.log("final data = ", finalData)
      onSubmit(finalData as AgencySignUpFinal);
    } catch (error) {
      console.error("Upload failed:", error);
      form.setError("documents", { message: "Failed to upload documents" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* agency_name & address fields (unchanged) */}
          <FormField
            control={form.control}
            name="agency_name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Briefcase className="absolute left-0 top-3 h-5 w-5 text-gray-500" />
                    <Input
                      placeholder="Agency Name"
                      className="border-0 outline-none pl-8 shadow-none border-b rounded-none ring-0 focus:ring-0 focus:outline-none focus:border-b focus-visible:ring-0 focus-visible:outline-none"
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
                      placeholder="Address"
                      className="border-0 outline-none pl-8 shadow-none border-b rounded-none ring-0 focus:ring-0 focus:outline-none focus:border-b focus-visible:ring-0 focus-visible:outline-none"
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
                    <div className="flex flex-row items-center gap-2 opacity-60 py-2">
                      <FileText />
                      <p>Submit documents</p>
                    </div>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${isDragActive
                          ? "border-[#6A0DAD] bg-purple-50"
                          : "border-gray-300 hover:border-gray-400"
                        }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="mx-auto h-12 bg-gray-200 rounded-full w-12 text-gray-500 p-3 mb-3" />
                      <p className="text-sm text-gray-600">
                        {isDragActive ? "Drop files here" : "Tap / Drop to upload files"}
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
              disabled={uploading}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#6A0DAD] hover:bg-[#5a0c9d] py-6 text-lg font-semibold"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}