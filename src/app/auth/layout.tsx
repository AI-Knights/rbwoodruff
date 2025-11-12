import React from "react";
import GroupImage from "@/assets/Group 350.svg";
import Image from "next/image";
import LogoImage from "@/assets/logo (2).svg";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex overflow-hidden h-screen items-center justify-between">
      <div className="w-full lg:w-[60%] gap-6 flex flex-col ">
        {/* Logo & Tagline */}
        <div className=" text-center">
          <Image
            src={LogoImage}
            alt="NEWORKX Logo"
            width={380}
            height={78}
            className="mx-auto mb-2"
            priority
          />
        </div>

        <div>{children}</div>
      </div>
      <div className="w-[40%] min-h-screen hidden lg:block">
        <Image
          src={GroupImage}
          className="min-h-screen"
          height={600}
          width={600}
          alt="group image"
        ></Image>
      </div>
    </div>
  );
}
