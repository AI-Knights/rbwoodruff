"use client";

import Image from "next/image";
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
    <div className="  flex flex-col items-center justify-center">
     
      {/* Role Selection Cards */}
    <div>
          <div className="w-full flex flex-col gap-4">
        {roles.map((role, index) => (
          <div
            key={index}
            className=" rounded-md w-full border border-black p-10 hover:shadow-xl transition-shadow duration-300 "
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
                <Link className="" href={`/auth/register/${role.path}`} >
                    <div className="mt-5 w-full text-center bg-[#6A0DAD] hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200">  
                        Proceed
                    </div>
                </Link >
            </div>
          </div>
        ))}
      </div>
    </div>

     
    </div>
  );
}