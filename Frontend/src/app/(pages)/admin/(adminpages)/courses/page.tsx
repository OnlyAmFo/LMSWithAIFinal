"use client"
import { AddCourseForm } from '@/app/admincomponents/AddCourseForm'
import React, { useEffect } from 'react'
import useFetchData from '@/app/hooks/FetchData'
import { ClipLoader } from 'react-spinners'
const Courses = () => {
  let {getData,result,loading,responseError}=useFetchData();
  useEffect(() => {
      (async () => {
        await getData("/course/");
      })();
    }, []);
    useEffect(()=>{
      console.log(result);
    },[result])
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
    <div>
      <AddCourseForm />
      {/* <div className='flex flex-wrap gap-10'>
       { result?.courses?.map(ele:any=>{
        
        })
      }
      </div> */}
    </div>
  )
}

export default Courses
