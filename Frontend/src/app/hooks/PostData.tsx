"use client";
import useAxiosMultipart from "@/lib/axiosMultipart.config";
import { useEffect, useState } from "react";
const usePostData = () => {
  const [result, setResult] = useState([]);
  const [responseError, setResponseError] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const axiosInstance=useAxiosMultipart();
  const postData = async (url: string,formData:any) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(url,formData);
      setResult(data);
    } catch (error: any) {
      setResponseError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return { postData, result, responseError, loading };
};
export default usePostData;
