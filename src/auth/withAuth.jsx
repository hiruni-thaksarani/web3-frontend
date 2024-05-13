'use client';
import { useState,useEffect } from 'react';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      const checkLoggedIn = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            window.location.href = "/UserOnBoarding"; // Redirect to login page if token is not available
          } else {
            // Set token in axios default headers
            
            // Perform a check to see if the token is valid
            const response = await axios.get("http://localhost:4000/users/login");

            if (response.status === 200) {
              setIsLoggedIn(true);
            } else {
              window.location.href = "/UserOnBoarding"; // Redirect if user is not authenticated
            }
          }
        } catch (error) {
          console.error("Error checking login status:", error);
          window.location.href = "/"; // Redirect to login page on error
        }
      };

      checkLoggedIn();
    }, []); // Run only once on component mount

    if (!isLoggedIn) {
      return null; // Or any other component to render while authentication is in progress
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
