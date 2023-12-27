import AxiosCreator from "./httpServices";

export const GET = async (url: string) => {
  try {
    const res = await AxiosCreator.get(url);
    return res;
  } catch (error) {
    throw error;
  }
};

export const POST = async (url: string, payload: any) => {
  try {
    const res = await AxiosCreator.post(url, payload);
    return res;
  } catch (error) {
    throw error;
  }
};

export const PUT = async (url: string, payload: any) => {
  try {
    const res = await AxiosCreator.put(url, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const DELETE = async (url: string) => {
  try {
    const res = await AxiosCreator.delete(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};
