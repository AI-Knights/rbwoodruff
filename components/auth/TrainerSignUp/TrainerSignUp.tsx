"use client";
import React, { useState } from "react";
import TrainerInformationFirstSeps from "./TrainerInformationFirstSeps";
import { trainerSignUp, TrainerStep1, TrainerStep2 } from "@/validation";
import { useRouter } from "next/navigation";
import TrainerSecond from "./TrainerStep2";
import { useDispatch } from "react-redux";
import { useCreateAccountMutation } from "@/store/api/authSlice/authSlice";
import { setEmail } from "@/store/api/authSlice/emailSlice/emailSlice";

export default function TrainerSignUp() {
  const dispatch = useDispatch()
  const [createUser] = useCreateAccountMutation()
  const [apiError, setApiError] = useState("")
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [step1Data, setStep1Data] = useState<TrainerStep1 | null>(null);

  const handleStep1 = (data: TrainerStep1) => {
    setStep1Data(data);
    setStep(2);
  };

  const handleStep2 = async (data: TrainerStep2) => {
    if (!step1Data) return;

    const fullData = { ...step1Data, ...data };
    const result = trainerSignUp.safeParse(fullData);

    if (!result.success) {
      console.error(result.error);
      return;
    }

    dispatch(setEmail(result.data.email))

    try {
      const skillsArray = Array.isArray(result.data.skills)
        ? result.data.skills
        : result.data.skills.split(",").map(s => s.trim());

      await createUser({
        email: result.data.email,
        full_name: result.data.full_name,
        password: result.data.password,
        user_type: "training_provider",
        data: {
          experience: result.data.experience,
          specialization: result.data.specialization,
          skills: skillsArray,
          bio: result.data.bio,
        },
      }).unwrap();

      router.push("/auth/verification");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setApiError(err?.message || "Something went wrong");

      }
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="border rounded-2xl md:max-w-[702px] w-full p-4 md:px-14 py-8 flex flex-col  mx-auto " >
      <p className="text-xl md:text-5xl text-center font-bold py-4" >Sign Up</p>
      <div className="flex justify-center items-center mb-10">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= 1 ? "bg-[#6A0DAD] text-white" : "bg-gray-300"
            }`}
        >
          1
        </div>
        <div
          className={`w-16 h-1 transition-all ${step >= 2 ? "bg-[#6A0DAD]" : "bg-gray-300"
            }`}
        ></div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step == 2 ? "bg-[#6A0DAD] text-white" : "bg-gray-300"
            }`}
        >
          2
        </div>
        <div
          className={`w-16 h-1 transition-all ${step == 3 ? "bg-[#6A0DAD]" : "bg-gray-300"
            }`}
        ></div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step == 3 ? "bg-[#6A0DAD] text-white" : "bg-gray-300"
            }`}
        >
          3
        </div>
      </div>
      {step === 1 && (
        <TrainerInformationFirstSeps
          defaultValues={step1Data || undefined}
          onNext={handleStep1}
        />
      )}
      {step === 2 && (
        <TrainerSecond
          onBack={handleBack}
          onSubmit={handleStep2}
        ></TrainerSecond>
      )}
    </div>
  );
}
