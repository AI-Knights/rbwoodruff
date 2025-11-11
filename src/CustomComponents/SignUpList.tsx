"use client";

import Image from "next/image";
import LogoImage from "@/assets/logo (2).svg";
import Employe from "@/assets/emploer.svg"
import Trainer from "@/assets/Trainer.svg";
import Link from "next/link";

export default function SignUpList() {
  const roles = [
    {
      icon: Employe,
      title: "Employer",
      path : 'employee',
      description: "I am looking to hire job seekers and post job openings.",
      
    },
    {
      icon: Trainer,
      title: "Trainer",
      path : 'trainer',
      description: "I am looking to offer training programs and share various opportunities.",
      
    },
    {
      icon: Trainer,
      title: "Agency",
      path : 'agency' ,
      description: "Create your official agency account to manage cases and reports.",
      
    },
  ];

  return (
    <div className="min-h-screen bg-[#EDEDED] flex flex-col items-center justify-center p-6">
      {/* Logo & Tagline */}
      <div className="mb-12 text-center">
        <Image
          src={LogoImage}
          alt="NEWORKX Logo"
          width={380}
          height={78}
          className="mx-auto mb-2"
          priority
        />
     
      </div>

      {/* Role Selection Cards */}
    <div>
          <div className="w-full max-w-3xl  space-y-6">
        {roles.map((role, index) => (
          <div
            key={index}
            className=" rounded-md border border-black p-10 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className=" w-12 h-12  rounded-xl flex items-center justify-center">
               <Image width={50} height={50} src={role.icon} alt={role.title} ></Image>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {role.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {role.description}
                </p>
              </div>
            </div>
            <div>
                <Link className="" href={`/register/${role.path}`} >
                    <div className="mt-5 w-full text-center bg-[#6A0DAD] hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200">  
                        Proceed
                    </div>
                </Link >
            </div>
          </div>
        ))}
      </div>

        <div className="">
          <div  className="h-[300px] w-[600px] bg-[#3A47B0] rounded-xl"></div>
          <div className="h-[200px] w-[500px] bg-[#5F6EFF] rounded-xl"></div>
          <div className="h-[628px] bg-[#5291F2] rounded-xl w-[580px] "></div>
          <div className="h-[628px] bg-[#5291F2] rounded-xl w-[580px] " ></div>
        </div>
    </div>

     
    </div>
  );
}