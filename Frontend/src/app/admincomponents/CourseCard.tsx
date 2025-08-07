"use client";
//this component is for admin section
import React, { useEffect } from "react";
import { EditForm } from "./EditForm";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useDeleteData from "../hooks/DeleteData";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  isVerified: boolean;
  role: string;
  profile: string | null;
  createdAt: string; // ISO string (can also be Date)
  updatedAt: string;
}

export interface CourseType {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  visibility: "PUBLIC" | "PRIVATE"; // assuming these are the only two options
  thumbnail: string;
  teacherId: string;
  teacher: Teacher;
  enrollments: any[]; // You can replace `any` with a proper `Enrollment` type if needed
  createdAt: string;
  updatedAt: string;
}
interface CourseDataType{
  statusCode:number;
  message:string;
  success:boolean;
  data:CourseType
}
const CourseCard = ({ courseData }:{courseData:CourseType} ) => {
  const {deleteData ,result,loading,responseError}=useDeleteData();
  useEffect(()=>{
    if(result?.success) toast.success(result?.message || "course removed successfully");
    if(responseError) toast.success(responseError || "failed to remove course");
  },[responseError,result])
  return (
    <Card className="w-[300px]">
      <CardHeader className="relative">
        <Image
          src={courseData.thumbnail ? courseData.thumbnail : "/courses/default.jpg"}
          alt="course_thumbnail"
          height={300}
          width={0}
          className="w-full object-cover"
        />
      </CardHeader>
      <CardContent>
        <h1 className="font-bold">title: {courseData.title}</h1>
        <p>
        description:{courseData.description}
        </p>
      </CardContent>
      <CardFooter>
        <div>
          <p>level: {courseData.level}</p>
          <p>duration: {courseData.duration}</p>
          <p>created by: {courseData.teacher.firstName}</p>
        </div>
      </CardFooter>
      <CardFooter>
        {/* butto section  */}
        <div className="flex gap-10">
          <EditForm user={courseData}/>
          <Button onClick={()=>deleteData(`/course/remove/${courseData.id}`)}>
            {
              loading?<ClipLoader size={20} color="white"/> : "Remove"
            }
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
