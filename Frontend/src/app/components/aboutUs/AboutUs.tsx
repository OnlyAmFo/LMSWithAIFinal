import { Sparkles } from "lucide-react";
import Image from "next/image";
import React from "react";

const AboutUs = () => {
  return (
    <div className="h-auto my-5 flex flex-col lg:flex-row gap-20 px-5 md:px-20 lg:px-30 py-10">
      {/* about us profile section */}
      <section className="order-2 w-full  lg:order-1 flex-1 px-5 md:px-0">
        <div className=" group relative h-[300px] lg:h-full bg-[#006A62] rounded-3xl hover:scale-105 transition-all duration-500">
          <Image src="/banner_images/about_us.jpg"alt="about_us"fill className="object-cover rounded-3xl"/>
          {/* this is for border  */}
          <div className="absolute -top-3 -left-3 w-12 h-12 border-l-4 border-t-4  border-l-[#006A62] border-t-[#006A62]  transition-all duration-500 rounded-tl-3xl group-hover:scale-110"></div>
          <div className="absolute -top-3 -right-3 w-12 h-12 border-r-4 border-t-4  border-r-[#006A62] border-t-[#006A62]  transition-all duration-500 rounded-tr-3xl group-hover:scale-110"></div>
          <div className="absolute -bottom-3 -left-3 w-12 h-12 border-l-4 border-b-4  border-l-[#006A62] border-b-[#006A62]  transition-all duration-500 rounded-bl-3xl group-hover:scale-110"></div>
          <div className="absolute -bottom-3 -right-3 w-12 h-12 border-r-4 border-b-4  border-r-[#006A62] border-b-[#006A62]  transition-all duration-500 rounded-br-3xl group-hover:scale-110"></div>
        </div>
      </section>
      {/* about us description section */}
      <section className="order-1 lg:order-2 flex-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-[#FF8C5A] text-sm animate-bounce">
            <Sparkles />
          </span>
          <span className="text-gray-400">About us section</span>
        </div>
        <h1 className="font-bold text-4xl pb-3 py-4">
          Educate the populace to advance the nations
        </h1>
        {/* description section */}
        <div className="flex-1 text-gray-700 space-y-4 text-justify">
          <p>
            We are{" "}
            <strong className="text-[#FF8C5A]">Codesk Innovations</strong>,
            established in 2025, with a mission to transform tech education at
            the grassroots level. We offer in-school coding classes by
            partnering with schools, and also run structured online programs.
            Our course offerings range from{" "}
            <strong className="text-[#006A62]">
              Scratch programming, Python, Robotics/IoT
            </strong>{" "}
            to{" "}
            <strong className="text-[#006A62]">
              Frontend and Backend Development
            </strong>{" "}
            — all tailored at beginner, intermediate, and advanced levels.
          </p>
          <p>
            Our team includes experienced educators, tech leads, and software
            developers committed to delivering high-quality, engaging learning.
            Beyond education, we also provide professional services like{" "}
            <strong className="text-[#006A62]">
              web development, graphics designing, and application development
            </strong>
            . Our products are scalable, SEO-friendly, and future-ready. Located
            at <strong className="text-[#FF8C5A]">Damak Chowk</strong>, our goal
            is to empower students with digital skills to make them future-ready
            innovators.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
