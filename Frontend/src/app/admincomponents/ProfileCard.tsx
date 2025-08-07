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

const ProfileCard = ({ userdata }: any) => {
  const {deleteData,result,loading,responseError}=useDeleteData();
  useEffect(()=>{
    if(result?.success) toast.success(result?.message || "user removed successfully");
    if(responseError) toast.success(responseError || "failed to remove user");
  },[responseError,result])
  return (
    <Card className="w-[300px]">
      <CardHeader className="relative">
        <Image
          src={userdata.profile ? userdata.profile : "/students/stud1.jpg"}
          alt="user_profile"
          height={300}
          width={0}
          className="w-full object-cover"
        />
      </CardHeader>
      <CardContent>
        <p className="font-bold">
          {userdata.firstName + " " + userdata.lastName}
        </p>
      </CardContent>
      <CardFooter>
        <div>
          <p>Role: {userdata.role.toLowerCase()}</p>
        </div>
      </CardFooter>
      <CardFooter>
        {/* butto section  */}
        <div className="flex gap-10">
          <EditForm user={userdata}/>
          <Button onClick={()=>deleteData(`/admin/remove-user/${userdata.id}`)}>
            {
              loading?<ClipLoader size={20} /> : "Remove"
            }
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
