"use client";
import { AgencyStep1, AgencyStep2, agencySignUp } from "@/validation";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import AgencySignUpStepTow from "./AgencySignUpStepTow";
import AgencySignUpStepOne from "./AgencySignUpStepOne";

export default function AgencySignUp() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [agencyDataSetpOne, setSetpOneData] = useState<AgencyStep1 | null>(
    null
  );

  const handleStep1 = (data: AgencyStep1) => {
    setSetpOneData(data);
    setStep(2);
  };

  const handleStep2 = (data: AgencyStep2) => {
    if (!agencyDataSetpOne) return;

    const fullData = { ...agencyDataSetpOne, ...data };

    const result = agencySignUp.safeParse(fullData);
    if (result.success) {
      console.log("Final Data:", result.data);
      localStorage.setItem('role',"agency");
      redirect("/auth/verification");
    } else {
      console.error("Validation failed:", result.error);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="border rounded-2xl md:max-w-[702px] w-full p-4 md:px-14 py-8 flex flex-col  mx-auto ">
      <p className="text-xl md:text-5xl text-center font-bold py-4">Sign Up</p>
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
        <AgencySignUpStepOne
          defaultValues={agencyDataSetpOne || null}
          onNext={handleStep1}
        />
      )}
      {step === 2 && (
        <AgencySignUpStepTow
          onBack={handleBack}
          onSubmit={handleStep2}
        ></AgencySignUpStepTow>
        // <TrainerSecond
        //   onBack={handleBack}
        //   onSubmit={handleStep2}
        // ></>
      )}
    </div>
  );
}
