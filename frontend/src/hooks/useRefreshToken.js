import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get("/refresh", {
        withCredentials: true,
      });

      if (response.data?.accessToken && response.data?.role) {
        setAuth((prev) => {
          return {
            ...prev,
            accessToken: response.data.accessToken,
            role: response.data.role,
          };
        });
        return response.data.accessToken;
      } else {
        throw new Error("Missing access token or role in the response");
      }
    } catch (error) {
      console.error("Error during refresh:", error.response.data.error);
      return null;
    }
  };

  return refresh;
};

export default useRefreshToken;
