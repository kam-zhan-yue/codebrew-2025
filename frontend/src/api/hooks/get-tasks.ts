import axios from "axios";
import { API_URL } from "../constants";
import { useQuery } from "@tanstack/react-query";

export const useTasks = (userId: string) => {
  return useQuery({
    queryKey: ["tasks", userId],
    queryFn: () => {
      return axios.get(`${API_URL}/tasks/${userId}/`, {});
    },
  });
};
