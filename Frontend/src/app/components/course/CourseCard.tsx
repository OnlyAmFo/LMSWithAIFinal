import Image from "next/image";
interface CourseCardProps {
  icon: React.ElementType | string;
  heading: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  duration?: string;
  teacher?: { firstName: string; lastName: string };
  onClick?: () => void;
}

const CourseCard = ({
  icon: Icon,
  heading,
  level,
  description,
  duration = "3 months",
  teacher,
  onClick,
}: CourseCardProps) => {
  return (
    <div
      className="group w-full md:max-w-[230px] bg-[#FFF5F0] cursor-pointer rounded-xl flex flex-col gap-3 py-4 border-b-2 border-b-[#006A62] hover:text-white hover:bg-[#006A62] hover:border-b hover:border-b-[#FF8C5A] transition-all duration-500 hover:shadow-2xl hover:scale-110"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-pressed="false"
    >
      {typeof Icon === "string" ? (
        <Image src={Icon} alt="course_image" fill className="object-cover" />
      ) : (
        <Icon className="text-[#006A62] mx-auto text-6xl group-hover:text-white transition-colors duration-500" />
      )}

      <h2 className="pt-2 font-bold text-[16px] text-center group-hover:underline transition-all duration-500">
        {heading}
      </h2>
      {teacher && (
        <p className="text-xs text-center text-gray-500 group-hover:text-white transition-colors duration-500">
          By {teacher.firstName} {teacher.lastName}
        </p>
      )}
      <div className="px-8">
        <p className="pb-2 text-gray-600 group-hover:text-white transition-colors duration-500">
          {description}
        </p>
        <p className="text-sm text-[#006A62] group-hover:text-white transition-colors duration-500 pt-3 pb-1">
          level: {level}
        </p>
        <p className="text-sm text-[#006A62] group-hover:text-white transition-colors duration-500">
          duration: {duration}
        </p>
      </div>
    </div>
  );
};

export default CourseCard;
