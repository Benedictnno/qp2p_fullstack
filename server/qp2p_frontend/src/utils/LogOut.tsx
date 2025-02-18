import axios from "axios";
import { NavigateFunction } from "react-router-dom";

/**
 * Logs out the user by making an API call and clearing local storage.
 * @param navigate - React Router's `navigate` function for redirection.
 */
const LogOut = async (navigate: NavigateFunction): Promise<void> => {
  try {
    // Send the logout request to the server
    await axios.post(
      `https://qp2p.onrender.com/api/v1/auth/logout`,
      {},
      { withCredentials: true }
    );

    // Clear user data from local storage
    localStorage.clear();
    console.log("User successfully logged out");

    // Redirect to the login page
    navigate("/login", { replace: true });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};



export default LogOut;
