"use client";
import { AgencySignUpFinal, AgencyStep1, AgencyStep2, agencySignUp } from "@/validation";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import AgencySignUpStepTow from "./AgencySignUpStepTow";
import AgencySignUpStepOne from "./AgencySignUpStepOne";
import { useCreateAccountMutation } from "@/store/api/authSlice/authSlice";

export default function AgencySignUp() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [agencyDataSetpOne, setSetpOneData] = useState<AgencyStep1 | null>(
    null
  );

  const [createUser] = useCreateAccountMutation()

  const handleStep1 = (data: AgencyStep1) => {
    setSetpOneData(data);
    setStep(2);
  };


  const handleStep2 = async (data: AgencySignUpFinal) => {
    if (!agencyDataSetpOne) return;

    const fullData = { ...agencyDataSetpOne, ...data };


    console.log("final data : ", fullData)
    console.log("final data : ", data)
    try {
      await createUser({
        full_name: fullData.representative_name,
        email: fullData.email,
        password: fullData.password,
        user_type: "agency",
        data: {
          agency_name: fullData.agency_name,
          agency_id: fullData.agency_id,
          address: fullData.address,
          document_public_id : fullData.documents[0].document_public_id ,
          document_url : fullData.documents[0].secure_url
        },
      }).unwrap();

    } catch (error) {
      console.error("Registration failed:", error);
      alert("Error during registration");
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
