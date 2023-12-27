import axios from "axios";

let AxiosCreator: any;

export const nodeApiUrl = process.env.NEXT_PUBLIC_API;

if (typeof window !== "undefined") {
  AxiosCreator = axios.create({
    baseURL: nodeApiUrl,
    headers: {
      Authorization: localStorage?.getItem("accessToken") || "",
    },
  });

  AxiosCreator.interceptors.request.use((config: any) => {
    const configHeaders = config.headers;
    configHeaders.Authorization = localStorage?.getItem("accessToken") || "";
    return config;
  });

  AxiosCreator.interceptors.response.use(
    (res: any) => {
      return res;
    },
    (err: any) => {
      if (err?.response?.status === 401) {
        console.log("401 err : ", err);
      }

      throw err?.response;
    }
  );
}

export default AxiosCreator;
