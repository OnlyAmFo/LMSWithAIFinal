import React from "react";
import Link from "next/link";
import FooterComponents from "./FooterComponents";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { BsStars } from "react-icons/bs";

const contact = [
  "Contact Us",
  "+977 9800000000",
  "codeskinnovations@gmail.com",
  "Damak chowk,Jhapa",
];
const services = [
  "Our Services",
  "Web Development",
  "App Development",
  "Coding Class",
  "Graphics Design",
];
const support = [
  "Support",
  "Help Center",
  "Contact",
  "Bug Reports",
  "Feedback",
];
const privacyPolicy = ["privacy", "terms of services"];
const socialMedia = [FaFacebook, FaSquareXTwitter, FaLinkedin, FaGithub];
const Footer = () => {
  return (
    <div className="bg-[#FFF5F0] relative  h-auto">
      {/*  */}
      <div className="absolute h-20 w-11/12 md:w-1/2 bg-[#FF8C5A] -top-5 left-[50%] translate-x-[-50%] text-white grid place-content-center">
        <div className="flex gap-2 animate-bounce">
          <span>
            <BsStars className="text-2xl" />
          </span>
          <span className="text-sm md:text-[14px]">
            {" "}
            One Stop digital solution{" "}
            <strong className="font-bold animate-pulse">
              {" "}
              codeskinnovation
            </strong>
          </span>
          <span>
            <BsStars className="text-2xl" />
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-12 md:gap-30 px-5 md:px-20 lg:px-30 pt-20 pb-10 border-b border-b-[#FF8C5A]">
        {/* social media link seciton with small intro */}
        <div className="max-w-[300px]">
          <h1 className="text-2xl font-bold text-[#FF8C5A] ">
            codeskinnovation
          </h1>
          <p className="py-5">
            We are renowned for our exceptional service and high client success
            rate, with a mission to deliver quality IT education from the heart
            of Eastern Nepal.
          </p>
          {/* social media section */}
          <div className="flex gap-4">
            {socialMedia.map((Ele: React.ComponentType, index: number) => {
              return (
                <span key={index} className=" text-2xl">
                  <Ele />
                </span>
              );
            })}
          </div>
        </div>
        {/* additional info section */}
        <div className="flex flex-wrap gap-10 md:gap-20">
          <FooterComponents data={services} />
          <FooterComponents data={support} />
          <FooterComponents data={contact} />
        </div>
      </div>
      <div className=" h-auto md:h-14 flex flex-wrap justify-between items-center px-5 md:px-20 lg:px-30 py-5 md:py-0 ">
        <span className="order-2 md:order-1">
          © 2025 codeskinnovation. All rights reserved.
        </span>
        <div className="order-1 md:order-2 flex gap-10">
          {privacyPolicy.map((ele: string, index: number) => {
            return (
              <Link
                key={index}
                href="#"
                className="hover:text-[#006A62] transition-colors duration-500 font-semibold"
              >
                {ele}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Footer;
