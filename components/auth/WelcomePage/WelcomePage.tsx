"use client"
import { redirect } from "next/navigation";

export default function WelcomePage() {
  const gotoDashBoard = ()=>{
    const role = localStorage.getItem('role')
    redirect(role ==='agency'?'/agency-dashboard':role==='trainer'?'/training-provider-dashboard':role==='employer'?'/employer-dashboard':'/dashboard')
  }
  return (
    <div>
      <div className="p-6 mx-auto md:p-10 border rounded-xl my-4 md:my-10 max-w-3xl" >
        <p className="text-center font-bold text-xl md:text-5xl "> Welcome</p>
        <p className="pb-10  text-xl text-center pt-2" >
          Your recruiter account is ready. Start <br /> posting jobs and find the right
          talent today
        </p>
        <button onClick={gotoDashBoard} className="bg-[#6A0DAD] font-semibold w-full rounded text-white text-center py-2 cursor-pointer" >Continue</button>
      </div>
    </div>
  );
}
