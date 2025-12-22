
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Delete, Eye, SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import DeleteTrainingDialog from "./DeleteTrainingDialog";
import { useState } from "react";

interface ITraining {
    id: string;
    training_Name: string;
    training_Link: string;
    training_Duration: string;
    training_Deadline: string;
}

const trainingData: ITraining[] = [
    {
        id: "1",
        training_Name: "Graphics Design & Freelancing",
        training_Link: "https://bohubrihi.com/courses/graphics-design",
        training_Duration: "4 Months",
        training_Deadline: "30 Nov, 2025",
    },
    {
        id: "2",
        training_Name: "Digital Marketing Professional",
        training_Link: "https://10minuteschool.com/courses/digital-marketing",
        training_Duration: "6 Months",
        training_Deadline: "15 Dec, 2025",
    },
    {
        id: "3",
        training_Name: "Full Stack Web Development (MERN)",
        training_Link: "https://programming-hero.com/course/web-development",
        training_Duration: "7 Months",
        training_Deadline: "25 Nov, 2025",
    },
    {
        id: "4",
        training_Name: "Flutter Mobile App Development",
        training_Link: "https://learnwithsumit.com/courses/flutter",
        training_Duration: "5 Months",
        training_Deadline: "10 Dec, 2025",
    },
    {
        id: "5",
        training_Name: "Professional Video Editing",
        training_Link: "https://bit.lms.gov.bd/course/video-editing",
        training_Duration: "3 Months",
        training_Deadline: "20 Nov, 2025",
    },
    {
        id: "6",
        training_Name: "UI/UX Design with Figma",
        training_Link: "https://uidesign.school/course/ui-ux",
        training_Duration: "4 Months",
        training_Deadline: "30 Nov, 2025",
    },
    {
        id: "7",
        training_Name: "Shopify Dropshipping A to Z",
        training_Link: "https://ecommercebd.com/course/shopify",
        training_Duration: "2.5 Months",
        training_Deadline: "12 Dec, 2025",
    },
    {
        id: "8",
        training_Name: "Data Analytics with Python & Power BI",
        training_Link: "https://behancer.com/course/data-analytics",
        training_Duration: "4 Months",
        training_Deadline: "18 Dec, 2025",
    },
    {
        id: "9",
        training_Name: "Amazon Affiliate Marketing",
        training_Link: "https://creativeit.com.bd/course/affiliate-marketing",
        training_Duration: "3 Months",
        training_Deadline: "05 Dec, 2025",
    },
    {
        id: "10",
        training_Name: "CCTV & Networking Professional",
        training_Link: "https://bit.lms.gov.bd/course/cctv-networking",
        training_Duration: "3 Months",
        training_Deadline: "28 Nov, 2025",
    },
];




export default function TrainingLists() {
    const [confirm, setConfirm] = useState<boolean>(false)
    return (
        <div className="w-full space-y-4">
          
            <div>
                <InputGroup className="bg-white rounded-full w-fit ">
                    <InputGroupInput placeholder="Search by name or ID" />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {/* Table */}
            <div className="border bg-white rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold" >Training Name</TableHead>
                            <TableHead className="font-bold" >Training Link</TableHead>
                            <TableHead className="font-bold" >Training Duration</TableHead>
                            <TableHead className="font-bold" >Training Deadline</TableHead>
                            <TableHead className="text-center font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trainingData.map((training) => (
                            <TableRow key={training.id}>
                                <TableCell className="font-medium">{training.training_Name}</TableCell>
                                <TableCell>{training.training_Link}</TableCell>
                                <TableCell>{training.training_Duration}</TableCell>
                                <TableCell className="text-green-600 font-medium">
                                    {training.training_Deadline}
                                </TableCell>

                                <TableCell className="text-center">
                                    <DeleteTrainingDialog trainingName={training.training_Name} onConfirm={setConfirm} >
                                        <Button className=" cursor-pointer " variant="ghost" size="icon">
                                            <Delete></Delete>

                                        </Button>
                                    </DeleteTrainingDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}