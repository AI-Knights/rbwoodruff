"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Edit, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import {
    useAllCategorysQuery,
    useUpdateProgrammMutation,
} from "@/store/api/trainerSlice/trainerSlice";

import { toast } from "sonner";
import { TrainingProgram } from "@/types/trainer/trainer";

/* ---------------- Schema ---------------- */

const trainingSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    category: z.string().min(1, "Category is required"),
    external_link: z.string().url("Must be a valid URL").or(z.literal("")),
    duration: z.coerce.number().min(1, "Duration is required"),
    duration_unit: z.enum(["hours", "days", "weeks"]),
    deadline: z.date({ message: "Deadline is required" }),
    is_active: z.boolean(),
});

type TrainingFormData = z.infer<typeof trainingSchema>;

/* ---------------- Component ---------------- */

interface EditTrainingDialogProps {
    training: TrainingProgram;
}

export default function EditTrainingDialog({ training }: EditTrainingDialogProps) {
    const [open, setOpen] = useState(false);
    const [updateProgram] = useUpdateProgrammMutation();
    const { data: categories, isLoading: isLoadingCats } = useAllCategorysQuery();

    const form = useForm({
        resolver: zodResolver(trainingSchema),
        defaultValues: {
            name: training.name,
            description: training.description,
            category: training.category, // assuming this is ID from API
            external_link: training.external_link,
            duration: training.duration,
            duration_unit: training.duration_unit as "hours" | "days" | "weeks",
            deadline: new Date(training.deadline),
            is_active: training.is_active,
        },
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = form;

    // Reset form when training prop changes or dialog opens
    useEffect(() => {
        if (open) {
            reset({
                name: training.name,
                description: training.description,
                category: training.category,
                external_link: training.external_link,
                duration: training.duration,
                duration_unit: training.duration_unit as "hours" | "days" | "weeks",
                deadline: new Date(training.deadline),
                is_active: training.is_active,
            });
        }
    }, [open, training, reset]);

    const deadline = watch("deadline");

    const onSubmit = async (data: TrainingFormData) => {
        const payload = {
            name: data.name,
            description: data.description,
            category: data.category,
            external_link: data.external_link,
            deadline: format(data.deadline, "yyyy-MM-dd"),
            duration: data.duration,
            duration_unit: data.duration_unit,
            is_active: data.is_active,
        };

        try {
            await updateProgram({ id: training.id, data: payload }).unwrap();
            toast.success("Training program updated successfully");
            setOpen(false);
        } catch (e) {
            const error = e as { data?: { description?: string } };
            toast.error(error?.data?.description || "Failed to update program");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:text-blue-600">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto w-full">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                        Edit Training Program
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <Label htmlFor="name" className="text-base font-medium">Program Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Professional Web Development Bootcamp"
                                className="h-11"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category" className="font-medium">Category</Label>
                            <select
                                id="category"
                                className="w-full border border-input bg-background rounded-md px-3 h-11 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                {...register("category")}
                            >
                                <option value="" disabled>Select Category</option>
                                {categories?.results?.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="text-sm text-red-500">
                                    {errors.category.message}
                                </p>
                            )}
                        </div>

                        {/* External Link */}
                        <div className="space-y-2">
                            <Label htmlFor="external_link" className="font-medium">Training Link (URL)</Label>
                            <Input
                                id="external_link"
                                type="url"
                                placeholder="https://..."
                                className="h-11"
                                {...register("external_link")}
                            />
                            {errors.external_link && (
                                <p className="text-sm text-red-500">
                                    {errors.external_link.message}
                                </p>
                            )}
                        </div>

                        {/* Duration Section */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="duration" className="font-medium">Duration Value</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    placeholder="12"
                                    className="h-11"
                                    {...register("duration")}
                                />
                                {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="font-medium">Unit</Label>
                                <select
                                    className="w-full border border-input bg-background rounded-md px-3 h-11 text-sm"
                                    {...register("duration_unit")}
                                >
                                    <option value="hours">Hours</option>
                                    <option value="days">Days</option>
                                    <option value="weeks">Weeks</option>
                                </select>
                            </div>
                        </div>

                        {/* Deadline */}
                        <div className="space-y-2">
                            <Label className="font-medium">Application Deadline</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full h-11 justify-start text-left font-normal",
                                            !deadline && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {deadline ? format(deadline, "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 z-50">
                                    <div className="pointer-events-auto">
                                        <Calendar
                                            mode="single"
                                            selected={deadline}
                                            onSelect={(date) =>
                                                setValue("deadline", date!, {
                                                    shouldValidate: true,
                                                })
                                            }
                                            initialFocus
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                            {errors.deadline && (
                                <p className="text-sm text-red-500">
                                    {errors.deadline.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="font-medium pb-1 block">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Detailed description of what learners will gain..."
                            className="min-h-32 resize-none text-base p-4 leading-relaxed"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end pt-4 border-t gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-black text-white px-8 h-11 hover:bg-gray-800 transition-colors"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
