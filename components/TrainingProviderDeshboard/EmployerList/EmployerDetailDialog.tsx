// components/EmployerDetailDialog.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Briefcase, DollarSign, User, Clock, CheckCircle } from "lucide-react";
import { Job } from "@/types/trainer/trainer";

interface EmployerDetailDialogProps {
    employer: Job ;
    onSet: (value: boolean) => void;
    showModal: boolean
}

export default function EmployerDetailDialog({
    employer, onSet, showModal
}: EmployerDetailDialogProps) {
    return (
        <Dialog open={showModal} onOpenChange={onSet} >


            <DialogContent className="sm:max-w-xl mx-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Employer Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Employer Name */}



                    <div className=" grid grid-cols-2 gap-4">
                        {/* Salary & Active Listings - Side by side */}
                        <div className="flex flex-col gap-4">
                            {/* Salary */}
                            <div className="flex items-center gap-3">
                                <div className="p-2 ">
                                    <User className="w-5 h-5 text-gray-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Employer Name</p>
                                    <p className="text-lg font-medium">{employer.employer_name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 ">
                                    <DollarSign className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Average Salary Range</p>
                                    <p className="text-lg font-semibold text-green-600">
                                        {employer.salary_min}k - {employer.salary_max} k
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Active Listings */}
                        {/* Training Program */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 ">
                                    <Briefcase className="w-5 h-5 text-gray-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Programs</p>
                                    <p className="text-lg font-medium">{employer.job_title}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 ">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Active Job Listings</p>
                                    <p className="text-lg font-semibold">
                                        {employer.number_of_openings} open
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={() => onSet(false)} className="flex-1 bg-black hover:bg-gray-800 text-white">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Verify Placement
                        </Button>

                        <Button onClick={() => onSet(false)} variant="outline" className="flex-1 border-pink-200 text-pink-600 hover:bg-pink-50">
                            <Clock className="w-4 h-4 mr-2" />
                            Mark as Pending
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}