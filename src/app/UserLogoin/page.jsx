"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import UserOnboarding from "../UserOnBoarding/page";
import { redirect } from "next/navigation";

// export async function generateStaticParams() {
//   // Return an array of objects, each containing the dynamic parameter value
//   return [
//     { params: { isLoggedIn: 'true' } },
//     { params: { isLoggedIn: 'false' } },
//   ];
// }

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const baseUrl=process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`$(baseUrl)/users/login`, {
        email,
        password,
      });
      const token = response.headers["authorization"];
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please enter valid email and password.");
      }
    }
  };

  useEffect(()=>{
    if(isLoggedIn){
      redirect("/UserOnBoarding/")
    }
  },[isLoggedIn])

  // if (isLoggedIn) {
  //   return <UserOnboarding />;
  // }

  return (
    <div className="w-full max-w-xl mt-32 m-auto bg-white shadow-md border border-mainColor rounded pb-8 mb-4">
      <div className="bg-mainColor px-10 py-2"></div>
      <h1 className="text-2xl mt-10 font-bold mb-4 text-center">Login</h1>
      <p className="text-gray-700 text-base mb-4 px-10">
        Only the registered admins can login to the system. Enter your email and password correctly.
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
  );
}
