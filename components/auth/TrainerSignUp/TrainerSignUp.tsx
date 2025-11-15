"use client";
import React, { useState } from "react";
import TrainerInformationFirstSeps from "./TrainerInformationFirstSeps";
import { trainerSignUp, TrainerStep1, TrainerStep2 } from "@/validation";
import { redirect } from "next/navigation";
import TrainerSecond from "./TrainerStep2";

export default function TrainerSignUp() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [step1Data, setStep1Data] = useState<TrainerStep1 | null>(null);

  const handleStep1 = (data: TrainerStep1) => {
    setStep1Data(data);
    setStep(2);
  };

  const handleStep2 = (data: TrainerStep2) => {
    if (!step1Data) return;

    const fullData = { ...step1Data, ...data };

    // Validate full data
    const result = trainerSignUp.safeParse(fullData);
    if (result.success) {
      console.log("Final Data:", result.data);
        redirect("/auth/verification");




    } else {
      console.error("Validation failed:", result.error);
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
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            step >= 1 ? "bg-[#6A0DAD] text-white" : "bg-gray-300"
          }`}
        >
          1
        </div>
        <div
          className={`w-16 h-1 transition-all ${
            step >= 2 ? "bg-[#6A0DAD]" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            step == 2 ? "bg-[#6A0DAD] text-white" : "bg-gray-300"
          }`}
        >
          2
        </div>
        <div
          className={`w-16 h-1 transition-all ${
            step == 3 ? "bg-[#6A0DAD]" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            step == 3 ? "bg-[#6A0DAD] text-white" : "bg-gray-300"
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
