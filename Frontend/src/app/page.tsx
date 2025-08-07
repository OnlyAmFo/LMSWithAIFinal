"use client"
import CourseCard from "./components/course/CourseCard";
import { HeroSection } from "./components/HeroSection/HeroSection";
import Courses from "./components/course/Courses";
import AboutUs from "./components/aboutUs/AboutUs";
import OurServices from "./components/ourServices/OurServices";
import useFetchData from "./hooks/FetchData";
import { useEffect } from "react";
import { get } from "http";

const Home = () => {
  let { getData, result, loading, responseError } = useFetchData();
  useEffect(() => {
    (async ()=>{
      await getData("/auth/isLoggedIn");
    })()
  }, []);
  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Course section */}
      <HeroSection />
      <section>
        <Courses />
      </section>
      <AboutUs />
      <OurServices />
    </div>
  );
};
export default Home;
