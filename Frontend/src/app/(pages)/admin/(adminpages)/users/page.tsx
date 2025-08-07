"use client";
import useFetchData from "@/app/hooks/FetchData";
import { useEffect, useState } from "react";
import { Toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import ProfileCard from "@/app/admincomponents/ProfileCard";
import { useRouter } from "next/navigation";
const Users = () => {
  const { getData, result, loading, responseError, errorCode } = useFetchData();
  const router = useRouter();
  useEffect(() => {
    (async () => {
      await getData("/admin/get-users");
    })();
  }, []);
  if (loading)
    return (
      <div className="h-full w-full grid place-content-center">
        <ClipLoader />
      </div>
    );
  if (responseError)
    return (
      <div className="grid place-content-center text-red-500 mt-10 font-bold">
        something went wrong, please try again later
      </div>
    );
  return (
    <div className="h-full w-full bg-amber-100">
      {result?.data?.users?.length === 0 ? (
        <div>There is no data</div>
      ) : (
        <div className="h-full w-full flex flex-wrap gap-10 p-10">
          {result?.data?.users?.map((ele: any, index: number) => {
            return (
              <div key={ele.id}>
                <ProfileCard userdata={ele}/>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Users;
