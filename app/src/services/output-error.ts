import { isAxiosError } from "axios";
import { toast } from "react-toastify";

export const outputError = (error: Error) => {
  if (isAxiosError(error) && error.response?.data?.message)
    return toast.error(error.response.data.message);

  return toast.error("Unknown error");
};
