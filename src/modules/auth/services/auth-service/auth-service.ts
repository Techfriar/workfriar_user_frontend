
export const useAuthService = () => {

  const redirectToGoogleLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    window.location.href = `${backendUrl}/api/auth/google-login`;
  };


  const handleAppLogin = async (token: string) => {
  try {

      // If the user is an admin, set the cookie
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      

      // Parse the response JSON
      const data = await response.json();
      

      if (response.ok && data.success) {
        return { success: true, message: data.message || "Login successful", data };
      } else {
        return { success: false, message: data.message || "Failed to set cookie" };
      }
    
  } catch (error) {
    console.error("Error in handleAppLogin:", error);
    return { success: false, message: "An error occurred while processing login." };
  }
  };

  const handleLogout = async () => {
    try {
      // Call the logout API route
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to login page after successful logout
        window.location.href = "/";
        return { success: true, message: data.message || "Logout successful" };
      } else {
        return { success: false, message: data.message || "Logout failed" };
      }
    } catch (error) {
      console.error("Error in handleLogout:", error);
      return { success: false, message: "An error occurred during logout." };
    }
  };

  return {
    handleAppLogin,
    redirectToGoogleLogin,
    handleLogout
  };
};










































// import http from "@/utils/http";

// /**
//  * Logs in using Google via the API.
//  *
//  * @returns A promise containing the response data.
//  * @throws {Error} If the request fails, an error will be thrown.
//  */
// export const loginWithGoogle = async (): Promise<any> => {
//   try {
//     // Make an HTTP POST request to log in
//     const response = await http().post("/api");
//     return response;
//   } catch (error) {
//     console.error("Error during Google login:", error);
//     throw error; // Rethrow the error to be handled by the caller
//   }
// };

// /**
//  * Sends an OTP to the provided email address.
//  *
//  *
//  * @param {string} email - The email address where the OTP should be sent.
//  * @returns {Promise<any>} A promise containing the server's response data.
//  * @throws {Error} If the request fails, an error will be thrown.
//  */
// export const sendOtp = async (email: string): Promise<any> => {
//   try {
//     const response = await http().post("/api");
//     return response;
//   } catch (error) {
//     console.error("Error sending otp:", error);
//     throw error; // Rethrow the error to be handled by the caller
//   }
// };

// /**
//  * Verifies the OTP entered by the user.
//  *
//  * @param {string} otp - The OTP entered by the user.
//  * @returns {Promise<any>} A promise containing the server's response data.
//  * @throws {Error} If the request fails, an error will be thrown.
//  */
// export const verifyOtp = async (otp: string): Promise<any> => {
//   try {
//     const response = await http().post("/api");
//     return response;
//   } catch (error) {
//     console.error("Error verifying otp:", error);
//     throw error; // Rethrow the error to be handled by the caller
//   }
// };
