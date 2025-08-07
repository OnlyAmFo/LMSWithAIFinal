import { Quote, Sparkles } from "lucide-react";
import { AiOutlinePython } from "react-icons/ai";
import CourseCard from "./CourseCard";
const Courses = () => {
  return (
    <section className="w-full my-20 px-5 md:px-20 lg:px-30">
      {/* intro */}
      <div className="flex gap-2 justify-center">
        <span className="text-[#FF8C5A] text-sm animate-bounce">
          <Sparkles />
        </span>
        <span className="text-gray-400">category section</span>
      </div>
      {/* main heading */}
      <h1 className="font-bold text-4xl pb-3 text-center">
        Explore our course categories
      </h1>
      <p className="text-[#006A62] text-center animate-pulse">
        {/* <span>
          <Quote />
        </span> */}
        For everyone of you, we offer a variet of courses
        {/* <span>
          <Quote />
        </span> */}
      </p>
      {/* course card section */}
      <div className="flex flex-wrap justify-center gap-5 mt-10">
        {[...new Array(5)].map((ele: any, index: number) => {
          return (
            <CourseCard
              key={index}
              icon={AiOutlinePython}
              heading="Python Programming"
              level="Beginner"
              description="basic python programming, beginner friendly, practical base"
            />
          );
        })}
      </div>
    </section>
  );
};
export default Courses;
