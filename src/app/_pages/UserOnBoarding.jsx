'use client' ;
import React, { useState } from "react";
import axios from "axios";

const UserOnboarding = () => {
  const [formData, setFormData] = useState({
    basic_info: {
      first_name: "",
      last_name: "",
      dob: "",
      gender: "",
    },
    contact_info: {
      mobile_number: "",
      email: "",
    },
    auth_info: {
      password: "",
    },
  });

  const [message, setMessage] = useState({
    type: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nestedFieldName = e.target.getAttribute("data-nested");
    setFormData((prevData) => ({
      ...prevData,
      [nestedFieldName]: {
        ...prevData[nestedFieldName],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/users/sign-up", formData);
      console.log("User created:", response.data);
      setMessage({
        type: "success",
        content: "User successfully added to the system",
      });
      clearForm();
    } catch (error) {
      console.error("Error creating user:", error);
      setMessage({
        type: "error",
        content: "Error. Please try again. Fill all details. The email must not be used before",
      });
    }
  };

  const clearForm = () => {
    setFormData({
      basic_info: {
        first_name: "",
        last_name: "",
        dob: "",
        gender: "",
      },
      contact_info: {
        mobile_number: "",
        email: "",
      },
      auth_info: {
        password: "",
      },
    });
    setMessage({
      type: "",
      content: "",
    });
  };

  return (
    <div className="mb-10 px-20">
      <form className="max-w-screen-xl ml-10 " onSubmit={handleSubmit}>
        <div className="flex flex-col mt-32 ml-20 mr-20 border border-gray-300 shadow-md">
          <div className="text-3xl ml-5 font-bold mb-5 mt-10 ml-10">
            User Onboarding
          </div>
          <div className="text-lg ml-10 mb-10">
            User details for user registration.
          </div>
          {message.type === "success" && (
            <div className="text-green-500 ml-10 mb-5">{message.content}</div>
          )}
          {message.type === "error" && (
            <div className="text-red-500 ml-10 mb-5">{message.content}</div>
          )}
          <div className="flex flex-wrap mb-6 px-10">
            <div className="w-full mb-6 md:mb-0">
              <label className="block text-gray-700 text-lg font-semibold mb-2">
                Basic Details
              </label>
              <div className="w-full grid grid-cols-3 gap-x-10">
                <input
                  className="text-gray-700 border border-gray-400 rounded py-3 px-6 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-first-name"
                  type="text"
                  name="first_name"
                  data-nested="basic_info"
                  value={formData.basic_info.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                />
                <input
                  className="w-80 text-gray-700 border border-gray-400 rounded py-3 px-6 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-last-name"
                  type="text"
                  name="last_name"
                  data-nested="basic_info"
                  value={formData.basic_info.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
                <input
                  className="w-80 text-gray-700 border border-gray-400 rounded py-3 px-6 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-date-of-birth"
                  type="date"
                  name="dob"
                  data-nested="basic_info"
                  value={formData.basic_info.dob}
                  onChange={handleChange}
                  placeholder="Date of birth"
                />
                <select
                  className="border border-gray-400 rounded py-3 px-6 mb-3 leading-tight focus:outline-none focus:bg-white text-gray-700 pr-8"
                  id="grid-gender"
                  name="gender"
                  data-nested="basic_info"
                  value={formData.basic_info.gender}
                  onChange={handleChange}
                >
                  <option value="" disabled className="text-gray-700">
                    Gender
                  </option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-10 px-10">
            <div className="w-full px-3 mb-10 md:mb-0">
              <label className="block text-gray-700 text-lg font-semibold mb-2">
                Contact Details
              </label>
              <div className="w-full grid grid-cols-3 gap-x-20">
                <input
                  className="text-gray-700 border border-gray-400 rounded py-3 px-6 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-mobile-number"
                  type="text"
                  name="mobile_number"
                  data-nested="contact_info"
                  value={formData.contact_info.mobile_number}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                />
                <input
                  className="w-80 text-gray-700 border border-gray-400 rounded py-3 px-6 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-email"
                  type="text"
                  name="email"
                  data-nested="contact_info"
                  value={formData.contact_info.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="mt-10 ml-36 flex gap-x-10 justify-end mr-20">
          <button
            type="button"
            class="py-3 px-16 inline-flex items-center gap-x-2 text-m font-semibold rounded-lg border border-mainColor bg-white text-mainColor hover:bg-blue-100 focus:border-mainColor focus:outline-none active:border-mainColor active:outline-none"
            onClick={clearForm}
          >
            Clear
          </button>
          <button
            type="submit"
            class="py-3 px-16 inline-flex items-center gap-x-2 text-m font-semibold rounded-lg border border-transparent bg-mainColor text-white hover:bg-lightColor focus:border-transparent focus:outline-none active:border-transparent active:outline-none"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserOnboarding;
