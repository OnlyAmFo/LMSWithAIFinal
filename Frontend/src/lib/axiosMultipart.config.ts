"use client"
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const useAxiosMultipart=({errorMessage}:{errorMessage?:string}={})=>{
  const router=useRouter();
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, 
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  response=>response,
  error=>{
    const {status}=error.response;
    if(status===401) {
      toast.error(errorMessage ?errorMessage : "session expires, please login to access");
    router.push("/");
    }
    return Promise.reject(error);
  }
  )
  return axiosInstance;
}


export default useAxiosMultipart;
