"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import { IconAlertCircle, IconCircleCheck } from "@tabler/icons-react";
import { request } from "http";
import { redirect, useParams } from "next/navigation";
import LoggingAlert from "../../../components/LoggingAlert"

// Alert component to display messages
const Alert = ({ type, content, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center mb-[800px]">
      <div
        className={`bg-${
          type === "success" ? "green" : "red"
        }-100 border-${type === "success" ? "green" : "red"}-500 text-black px-4 py-5 z-50 rounded-md`}
      >
        <div className="flex items-center">
          <div className="mr-2">
            {type === "success" ? (
              <IconCircleCheck className="text-green-700" />
            ) : (
              <IconAlertCircle className="text-red-700" />
            )}
          </div>
          <div className="mr-2">
            <p className="text-sm mr-20">{content}</p>
          </div>
          <div>
            <button
              onClick={onClose}
              className="inline-flex items-center mr-1 ml-10 text-sm font-bold rounded-lg border border-transparent text-black"
            >
              X
            </button>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
    </div>
  );
};

export default function UserOnboarding({params}) {
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [existingEmails, setExistingEmails] = useState([]);
  const [showLoggingAlert, setShowLoggingAlert] = useState(false);
  const [loggingAlertMessage, setLoggingAlertMessage] = useState({
    type: "",
    content: "",
  });

  const closeLoggingAlert = () => {
    setShowLoggingAlert(false);
    setLoggingAlertMessage({ type: "", content: "" });
  };
  // const params = useParams<{tag:string,item:string}>();
  

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href="/";
      
    }
  }, []);

  const [formData, setFormData] = useState({
    type: "USER",
    status: "ONBOARD",
    basic_info: {
      first_name: "",
      last_name: "",
      dob: "",
      gender: "",
    },
    contact_info: {
      email: "",
      mobile_numbers: [""],
    },
    auth_info: {
      password: "",
    },
  });
  const [message, setMessage] = useState({
    type: "",
    content: "",
  });

  

  const nameRegex = /^[a-zA-Z\s']*$/;
  const mobileRegex = /^[0-9]{1,15}$/;

  const handleChange = (e, index) => {
    const { value } = e.target;
    const tempMobileNumbers = [...formData.contact_info.mobile_numbers];
    tempMobileNumbers[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      contact_info: {
        ...prevData.contact_info,
        mobile_numbers: tempMobileNumbers,
      },
    }));
  };

  const handleAddMobileField = () => {
    if (formData.contact_info.mobile_numbers.length < 3) {
      setFormData((prevData) => ({
        ...prevData,
        contact_info: {
          ...prevData.contact_info,
          mobile_numbers: [...prevData.contact_info.mobile_numbers, ""],
        },
      }));
    }
  };

  const handleRemoveMobileField = (index) => {
    if (formData.contact_info.mobile_numbers.length > 1) {
      const tempMobileNumbers = [...formData.contact_info.mobile_numbers];
      tempMobileNumbers.splice(index, 1);
      setFormData((prevData) => ({
        ...prevData,
        contact_info: {
          ...prevData.contact_info,
          mobile_numbers: tempMobileNumbers,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
  
    const { first_name, last_name } = formData.basic_info;
    const { mobile_numbers ,email} = formData.contact_info;
  
    // Check if any required field is empty
    if (!first_name || !last_name || !email || mobile_numbers.some(number => !number)) {
      setMessage({
        type: "error",
        content: "Please fill in all required fields.",
      });
      
      return;
    }
    // Name validation
    if (!nameRegex.test(first_name) || !nameRegex.test(last_name) || first_name.length > 25 || last_name.length > 25) {
      setMessage({
        type: "error",
        content: "Please provide valid first and last name (maximum 25 characters, only letters allowed).",
      });
      setShowUpdateConfirmation(false);
      return;
    }
  
    // Mobile number validation
    if (mobile_numbers.some((number) => !mobileRegex.test(number))) {
      setMessage({
        type: "error",
        content: "Please provide valid mobile numbers (maximum 15 digits, numbers only).",
      });
      setShowUpdateConfirmation(false);
      return;
    }

    
      // Check if email already exists
      const existingUsersResponse = await axios.get("http://localhost:4000/getUsers");
      const existingUsersEmails = existingUsersResponse.data.map(user => user.contact_info.email);
      if (existingUsersEmails.includes(email)) {
        setMessage({
          type: "",
          content: "",
        })
        return;
      } else {
        
        setShowUpdateConfirmation(true);
      }
    // } catch (error) {
    //   console.error("Error checking existing email:", error);
    //   setMessage({
    //     type: "error",
    //     content: "Error checking existing email. Please provide a different email.",
    //   });
    // }
    
  };

  const clearForm = () => {
    setFormData({
      type: "USER",
      status: "ONBOARD",
      basic_info: {
        first_name: "",
        last_name: "",
        dob: "",
        gender: "",
      },
      contact_info: {
        email: "",
        mobile_numbers: [""],
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

  const handleConfirmation = async () => {
    setShowUpdateConfirmation(false); // Close the confirmation dialog
   
    try {
      const response = await axios.post(
        "http://localhost:4000/users/sign-up",
        formData
      );
      console.log("User created:", response.data);

      setShowSuccessAlert(true);
      setMessage({
        type: "success",
        content: "User successfully added to the system",
      });
      clearForm();
    } catch (error) {
      console.error("Error creating user:", error);
      setMessage({
        type: "error",
        content:
          "Error. Please try again. Fill all details. The email must not be used before",
      });
    }
  };

  console.log(params.isLoggedIn);

  return (
    <div className="">


      <Navbar />
      {message.content && (
        <Alert type={message.type} content={message.content} onClose={() => setMessage({ type: "", content: "" })} />
      )}

      {params.isLoggedIn?
      <div className="fixed  inset-0 top-0 flex z-50 ml-[500px] ">
            {/* <div className="fixed inset-0 z-50 flex justify-center items-center mb-[800px]"> */}

      <div className="bg-green-100 p-5 rounded-md w-[500px] mb-[770px] h-[65px]">
        <div className="flex items-center ">
          <div className="mr-2">
            <IconCircleCheck className="text-green-700" />
          </div>
          <div className="mr-2">
            <p className="text-sm mr-16 ">
              User has been added successfully.
            </p>
          </div>
          <div>
            <button
              onClick={() => window.location.href='/UserOnBoarding'} // Add this line
              className="inline-flex items-center mr-1 ml-16 text-sm font-bold rounded-lg border border-transparent text-black"
            >
              X
            </button>
          </div>
        </div>
      </div>
    </div>:""
      }

      {showUpdateConfirmation && (
        <div>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30"></div>
          <div className="fixed inset-0 flex justify-center items-center z-40">
            <div className="bg-white w-[450px] relative z-50">
              <div className="flex items-center text-lg py-5 pl-5 pr-10 font-semibold mb-4 bg-mainColor text-white">
                <div className="mr-2">
                  <IconAlertCircle className="text-white" />
                </div>
                <div>Confirmation</div>
              </div>
              <p className="ml-10 mt-10">
                Are you sure you want to save this user?
              </p>
              <div className="flex justify-center mt-4 p-5 mb-5">
                <button
                  onClick={() => setShowUpdateConfirmation(false)}
                  className="mr-2 px-7 py-1 text-sm font-medium text-mainColor ml-32   border border-mainColor border-solid focus:outline-none "
                >
                  No
                </button>
                <button
                  onClick={()=>{
                    handleConfirmation();
                    setShowUpdateConfirmation(true)
                  }}
                  className="px-7 py-1 mr-3 ml-5 text-sm font-medium text-white bg-mainColor focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-green-100 p-5 rounded-md w-[500px] mb-[770px] h-[65px]">
            <div className="flex items-center ">
              <div className="mr-2">
                <IconCircleCheck className="text-green-700" />
              </div>
              <div className="mr-2">
                <p className="text-sm mr-16 ">
                  User has been added successfully.
                </p>
              </div>
              <div>
                <button
                  onClick={() => {
                    setShowSuccessAlert(false); // Close the delete alert
                    setShowUpdateConfirmation(false); // Close the delete confirmation box
                  }}
                  className="inline-flex items-center mr-1 ml-16 text-sm font-bold rounded-lg border border-transparent text-black"
                >
                  X
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

<div className="mb-10 py-10 px-0 w-full ">
        <form className="max-w-screen-full ml-1 " onSubmit={handleSubmit}>
          <div className="flex flex-col mt-32 ml-20 mr-20 border border-gray-300 shadow-md">
            <div className="text-3xl ml-5 font-semibold mb-5 mt-10 ml-10">
              User Onboarding
            </div>
            <div className="text-lg ml-10 mb-10">
              User details for user registration.
            </div>

            <div className="flex flex-wrap mb-6 px-10">
              <div className="w-full mb-6 md:mb-0">
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  Basic Details
                </label>
                <input type="hidden" value="USER" name="type" />
                <input type="hidden" value="ONBOARD" name="status" />
                <div className="w-full grid grid-cols-3 gap-x-20">
                  <input
                    className="text-gray-700 border border-gray-400 rounded py-3 px-6 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-first-name"
                    type="text"
                    name="first_name"
                    data-nested="basic_info"
                    value={formData.basic_info.first_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        basic_info: {
                          ...formData.basic_info,
                          first_name: e.target.value,
                        },
                      })
                    }
                    placeholder="First Name"
                  />
                  <input
                    className="w-full md:w-auto text-gray-700 border border-gray-400 rounded py-3 px-6 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-last-name"
                    type="text"
                    name="last_name"
                    data-nested="basic_info"
                    value={formData.basic_info.last_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        basic_info: {
                          ...formData.basic_info,
                          last_name: e.target.value,
                        },
                      })
                    }
                    placeholder="Last Name"
                  />
                  <input
                    className="w-full md:w-auto text-gray-700 border border-gray-400 rounded py-3 px-6 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-date-of-birth"
                    type="date"
                    name="dob"
                    data-nested="basic_info"
                    value={formData.basic_info.dob}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        basic_info: {
                          ...formData.basic_info,
                          dob: e.target.value,
                        },
                      })
                    }
                    placeholder="Date of birth"
                  />
                  <select
                    className="w-full md:w-auto border border-gray-400 rounded py-3 px-6 mb-3 leading-tight focus:outline-none focus:bg-white text-gray-700 pr-8"
                    id="grid-gender"
                    name="gender"
                    data-nested="basic_info"
                    value={formData.basic_info.gender}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        basic_info: {
                          ...formData.basic_info,
                          gender: e.target.value,
                        },
                      })
                    }
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

            <div className="flex flex-wrap mb-10 px-10">
              <div className="w-full mb-10 md:mb-0">
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  Contact Details
                </label>
                <div className="w-full grid grid-cols-3 gap-x-20">
                  <input
                    className="w-full md:w-auto text-gray-700 border border-gray-400 rounded py-3 px-6 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-email"
                    type="email"
                    name="email"
                    value={formData.contact_info.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact_info: {
                          ...formData.contact_info,
                          email: e.target.value,
                        },
                      })
                    }
                    placeholder="Email"
                  />

                  {formData.contact_info.mobile_numbers.map((number, index) => (
                    <div key={index} className="flex items-center mb-3">
                      <div className="flex-grow">
                        <input
                          className="w-[371px] text-gray-700 border border-gray-400 rounded py-3 px-6 leading-tight focus:outline-none focus:bg-white"
                          type="text"
                          name={`mobile_number_${index}`}
                          value={number}
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Mobile Number"
                        />
                      </div>
                      {index === 0 && (
                        <button
                          type="button"
                          className="inline-flex items-center font-light rounded-lg bg-white text-3xl px-3"
                          onClick={handleAddMobileField}
                        >
                          +
                        </button>
                      )}
                      {index > 0 && (
                        <div className="inline-flex items-center ml-0">
                          <button
                            type="button"
                            className="font-light rounded-lg bg-white text-3xl px-3"
                            onClick={() => handleRemoveMobileField(index)}
                          >
                            -
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 ml-36 flex gap-x-10 justify-end mr-20">
            <button
              type="button"
              className="py-3 px-16 inline-flex items-center gap-x-2 text-m font-semibold rounded-lg border border-mainColor bg-white text-mainColor hover:bg-blue-100 focus:border-mainColor focus:outline-none active:border-mainColor active:outline-none"
              onClick={clearForm}
            >
              Clear
            </button>
            <button
              type="submit"
              className="py-3 px-16 inline-flex items-center gap-x-2 text-m font-semibold rounded-lg border border-transparent bg-mainColor text-white hover:bg-lightColor focus:border-transparent focus:outline-none active:border-transparent active:outline-none"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  
}
