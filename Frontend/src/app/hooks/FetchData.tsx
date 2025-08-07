"use client";
import useAxios from "@/lib/axios.config";
import { useEffect, useState } from "react";
const useFetchData = () => {
  const [result, setResult] = useState<any>(null);
  const [responseError, setResponseError] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorCode, setErrorCode] = useState<number>();
  const axiosInstance = useAxios();
  const getData = async (url: string) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(url);
      setResult(data);
    } catch (error: any) {
      console.log({ error });
      setResponseError(error.response?.data?.message || "Something went wrong");
      setErrorCode(error.status);
    } finally {
      setLoading(false);
    }
  };
  return { getData, result, responseError, loading, errorCode };
};
export default useFetchData;
