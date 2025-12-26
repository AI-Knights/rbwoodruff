"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Camera, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetProfileInfoQuery, useUpdateProfileMutation } from "@/store/api/authSlice/authSlice";

// Zod schema
const profileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name must not exceed 50 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function AdminProfile() {
  const [image, setImage] = useState<string | undefined>(undefined);
  const { data } = useGetProfileInfoQuery()
  const [updateProfile] = useUpdateProfileMutation()
  console.log(data)
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.full_name,
        email: data.email,
      });
    }
  }, [data, form]);
  const onSubmit = async (data: ProfileFormData) => {
    // Simulate API call

    console.log("Profile saved:", { ...data, image });
    try {
      const response = await updateProfile({ profile_pic: image, full_name: data.name })
      toast.success(`${response.data?.full_name} updated`)
    } catch (e) {
      const error = e as Error
      toast.error(error.message)
    }
  };
  // console.log(image)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);

        // toast.success("Profile photo updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  console.log(image)

  return (
    <div className="w-full min-h-screen bg-white p-4 md:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            {/* Profile Photo Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative group">
                <Avatar className="w-20 h-20 ring-2 ring-gray-200">
                  <AvatarImage
                    src={image ?? data?.profile_pic ?? undefined}
                    alt="Profile photo"
                  />

                  <AvatarFallback className="bg-gray-100 text-2xl font-medium text-gray-700">
                    R
                  </AvatarFallback>
                </Avatar>

                {/* Hidden file input */}
                <input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {/* Hover overlay */}
                <label
                  htmlFor="profile-photo"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="h-6 w-6 text-white" />
                </label>
              </div>

              <div>
                <Label className="text-lg font-semibold text-gray-900">
                  Profile Photo
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Upload a new photo or change your existing one
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Profile name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        className="h-12 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                disabled={true}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-12 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full sm:w-auto px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium h-12"
              >
                {form.formState.isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}