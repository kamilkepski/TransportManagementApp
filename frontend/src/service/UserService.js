import axios from "axios";

class UserService {
  static BASE_URL = "http://localhost:8080/api";

  static async login(email, password) {
    try {
      const response = await axios.post(
        `${UserService.BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      const { accessToken, role } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("role", role);

      return response.data;
    } catch (err) {
      if (err.response) {
        throw new Error(err.response.data?.message || "Błąd serwera");
      } else if (err.request) {
        throw new Error("Wystąpił błąd połączenia z serwerem.");
      } else {
        throw new Error(err.message || "Wystąpił nieoczekiwany błąd.");
      }
    }
  }

  static async logout() {
    try {
      await axios.post(
        `${UserService.BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Błąd podczas wylogowywania:", err);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
  }

  static async refreshToken() {
    try {
      const response = await axios.post(
        `${UserService.BASE_URL}/refresh`,
        {},
        { withCredentials: true }
      );
      const { accessToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    } catch (err) {
      UserService.logout();
      throw new Error("Nie udało się odświeżyć tokena");
    }
  }

  static isTokenExpired(token) {
    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  }

  static verifyToken() {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    return !UserService.isTokenExpired(token);
  }

  static async isAuthenticated() {
    const token = localStorage.getItem("accessToken");
    if (!token || UserService.isTokenExpired(token)) {
      try {
        await UserService.refreshToken();
        return true;
      } catch {
        return false;
      }
    }
    return true;
  }
}

export default UserService;
