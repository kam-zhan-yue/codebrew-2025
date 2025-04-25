import axios from "axios"
import { BASE_URL, DEPLOYED_URL } from "../constants"
import { useQuery } from "@tanstack/react-query"

export const useHelloWorld = () => {
  return useQuery({
    queryKey: ['hello-world'], queryFn: () => {
      return axios.get(`${DEPLOYED_URL}/`, {});
    }
  })
}
