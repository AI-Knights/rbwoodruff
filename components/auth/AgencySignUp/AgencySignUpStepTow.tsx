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
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (data: AgencySignUpFinal) => void;
  defaultValues?: Partial<AgencyStep2>;
}

export default function AgencySignUpStepTow({
  onBack,
  isLoading,
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
              {isLoading ? <div role="status">
                <svg aria-hidden="true" className="w-4 h-4 text-neutral-tertiary animate-spin fill-brand" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
              </div> : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
