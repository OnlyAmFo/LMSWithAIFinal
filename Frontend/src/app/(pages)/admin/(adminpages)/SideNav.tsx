import React from "react";
import Link from "next/link";
const SideNav = () => {
  const adminlinks = [
    { item: "Dashboard", label: "/admin/" },
    { item: "Users", label: "/admin/users" },
    { item: "Courses", label: "/admin/courses" },
    { item: "Students", label: "/admin/students" },
    { item: "Assignments", label: "/admin/assignments" },
    { item: "Quizzes", label: "/admin/quizzes" },
    { item: "Others", label: "/admin/others" },
  ];
  return (
    <nav className="flex flex-col gap-10 w-60 border-r border-r-[#FF8C5A] px-5 pt-10">
      {adminlinks.map((ele, index) => {
        return (
          <Link
            key={index}
            href={ele.label}
            className="h-10 w-full bg-[#FF8C5A] text-white grid place-content-center rounded-sm"
          >
            {ele.item}
          </Link>
        );
      })}
    </nav>
  );
};

export default SideNav;
