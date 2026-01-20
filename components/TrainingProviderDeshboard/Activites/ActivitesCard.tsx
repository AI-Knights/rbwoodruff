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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {data.map((item, index) => {
        return (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col gap-3"
          >
            <p className="text-sm font-semibold text-gray-700">
              {item.title}
            </p>

            <div className="flex flex-row gap-3 items-center">
              <span className="text-2xl" style={{ color: item.iconColor }}>
                {item.icon}
              </span>
              <span className="text-3xl font-bold text-gray-900">{item.value}</span>
            </div>

            <p className="text-sm text-gray-600">{item.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
