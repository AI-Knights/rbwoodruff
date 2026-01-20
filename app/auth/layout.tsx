import React from "react";
import GroupImage from "@/assets/Group 350.svg";
import Image from "next/image";
import LogoImage from "@/assets/logo (2).svg";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex h-screen items-start lg:items-center justify-between pt-8 lg:pt-0">
      <div className="w-full lg:w-[60%] gap-6 flex flex-col px-6 xl:px-0 lg:pt-14 xl:pt-0">
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
      <div className="w-[40%] max-h-screen hidden lg:block">
        <Image
          src={GroupImage}
          className="h-screen float-right"
          height={500}
          width={500}
          alt="group image"
        ></Image>
      </div>
    </div>
  );
}
