import Link from "next/link";
import clsx from "clsx";
import React from "react";
const FooterComponents = ({ data }: { data: string[] }) => {
  return (
    <div className="">
      <ul className="flex flex-col gap-3">
        {data.map((ele: string, index: number) => {
          return index === 0 ? (
            <li
              key={index}
              className={clsx(
                "hover:text-[#006A62] transition-colors duration-500 font-bold text-xl"
              )}
            >
              {ele}
            </li>
          ) : (
            <li
              key={index}
              className={clsx(
                "hover:text-[#006A62] transition-colors duration-500"
              )}
            >
              <Link href="#">{ele}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FooterComponents;
