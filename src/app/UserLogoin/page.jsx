"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import UserOnboarding from "../UserOnBoarding/page";
import { useRouter } from "next/navigation";
import PageLoading from "../../components/PageLoading";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router=useRouter();
  const [userType, setUserType] = useState("");
  const [fcmToken1,setFcmToken]=useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fcmToken = localStorage.getItem('fcmToken')
    setFcmToken(fcmToken)
  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(`${baseUrl}/users/login`, {
        email:email,
        password:password,
        fcmToken:fcmToken1
      });

      console.log("response",response.headers.accesstoken);
      console.log("user type - ",response.data.user._id);
      console.log("response   ",response);
      console.log("fcm- ",response.data.user.fcmToken);

      
      localStorage.setItem("token", response.headers.accesstoken);
      localStorage.setItem("user_type", response.data.user.type);

      setUserType(userType);

      setIsLoggedIn(true);
      setShowSuccessMessage(true);

      //Update FCM token after successful login
      // const fcmToken = localStorage.getItem("fcmToken");
      // if (fcmToken) {
      //   await axios.post(
      //     `${baseUrl}/users/update-fcm-token`,
      //     { fcmToken },
      //   );
      // }

    } catch (error) {
      console.error("Login error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(
          "An error occurred. Please enter valid email and password."
        );
      }
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
     
    }
  }, [isLoggedIn]);

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div className="w-full max-w-xl mt-32">
      {isLoading && <PageLoading />}
        {showSuccessMessage && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-100 p-5 rounded-md w-[450px] mt-5 ">
            <div className="flex items-center justify-center ">
              <div className="mr-2">
                <p className="text-green-700">User has been logged successfully.</p>
              </div>
              <button
                onClick={() => {
                  setShowSuccessMessage(false);
                  router.push('/UserOnBoarding');
                  // window.location.href = '/UserOnBoarding';
                }}
                className="ml-auto"
              >
                X
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="w-full max-w-xl  bg-white shadow-md border border-mainColor rounded pb-8 ">
        <div className="bg-mainColor px-10 py-2"></div>
        <h1 className="text-2xl mt-10 font-bold mb-4 text-center">Login</h1>
        <p className="text-gray-700 text-base mb-4 px-10">
          Only the registered admins can login to the system. Enter your email and
          password correctly.
        </p>
        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 px-10 ml-20 mt-20">
            <input
              className="shadow appearance-none border rounded w-4/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 px-10 ml-20 mt-5">
            <input
              className="shadow appearance-none border rounded w-4/5 py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-sm text-blue-500 hover:text-blue-700 text-right mr-24">
              Forgot Password?
            </p>
          </div>
          <div className="mb-4 px-10 ml-20 mt-10">
            <button className="bg-mainColor hover:bg-white hover:text-mainColor  border border-mainColor text-white font-bold py-2 w-4/5 rounded focus:outline-none focus:shadow-outline">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
