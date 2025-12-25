import { ReactNode } from "react";
import { type IconType } from "react-icons";

interface ActiviteType {
  title: string;
  value: number | string | undefined;
  subtitle: string;
  iconColor: string;
  icon: ReactNode;
}

export default function ActivitesCard({ data }: { data: ActiviteType[] }) {
  return (
    <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 p-4">
      {data.map((item, index) => {
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-8  flex flex-col gap-4 border"
          >
            <p className="text-sm text-b font-semibold text-gray-700 md:text-md  mt-1">
              {item.title}
            </p>

            <div className="text-2xl flex flex-row gap-4 items-center justify-start w-full  font-bold text-gray-800">
              <p className={`text-[${item.iconColor}]`}> {item.icon}</p>
              <p className="text-3xl" >{item.value}</p>
            </div>

            <p className="text-xl">{item.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
