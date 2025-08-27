import { useFetchHOC } from "@rainbow_ljy/r-hooks";

export const useMFetch = useFetchHOC({
  interceptResponseSuccess: async (res, data, config) => {
    try {
      if (data instanceof Blob) return data;
      if (data.code !== 200) throw data;
      return data.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  headers: {
    "content-type": "application/json",
  },
  time: 30000,
  baseUrl: "http://192.168.192.202:5000",
});
