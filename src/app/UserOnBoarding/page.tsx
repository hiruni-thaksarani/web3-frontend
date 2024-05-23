"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { IconAlertCircle, IconCircleCheck } from "@tabler/icons-react";
import FcmTokenComp from "../../utils/hooks/firebaseForeground";
import PageLoading from "../../components/PageLoading";

// Alert component to display messages
const Alert = ({ type, content, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center mb-[800px] mt-10">
      <div
        className={`bg-${type === "success" ? "green" : "red"}-100 border-${
          type === "success" ? "green" : "red"
        }-500 text-black px-4 py-5 z-50 rounded-md`}
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

export default function UserOnboarding() {
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [fcmToken1, setFcmToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const [existingEmails, setExistingEmails] = useState([]);
  // const params = useParams<{tag:string,item:string}>();

  useEffect(() => {
    const fetchFcmToken = async () => {
      const FCM = localStorage.getItem("fcmToken");
      setFcmToken(FCM);
      // Update formData after fetching FCM token
      setFormData((prevData) => ({
        ...prevData,
        fcmToken: "",
      }));
    };
    fetchFcmToken();
  }, []);

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    }
  }, []);

  const [formData, setFormData] = useState({
    type: "USER",
    status: "ONBOARD",
    fcmToken: "",
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
  const emailRegex = /^[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[A-z]/;

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

    const { first_name, last_name } = formData.basic_info;
    const { mobile_numbers, email } = formData.contact_info;

    // Check if any required field is empty
    if (
      !first_name ||
      !last_name ||
      !email ||
      mobile_numbers.some((number) => !number)
    ) {
      setMessage({
        type: "error",
        content: "Please fill in all required fields.",
      });

      return;
    }
    // Name validation
    if (
      !nameRegex.test(first_name) ||
      !nameRegex.test(last_name) ||
      first_name.length > 25 ||
      last_name.length > 25
    ) {
      setMessage({
        type: "error",
        content:
          "Please provide valid first and last name (maximum 25 characters, only letters allowed).",
      });
      setShowUpdateConfirmation(false);
      return;
    }

    // Mobile number validation
    if (mobile_numbers.some((number) => !mobileRegex.test(number))) {
      setMessage({
        type: "error",
        content:
          "Please provide valid mobile numbers (maximum 25 digits, numbers only).",
      });
      setShowUpdateConfirmation(false);
      return;
    }

    if (!emailRegex.test(email) || email.length > 320 || email.length < 6) {
      setMessage({
        type: "error",
        content: "Please provide valid email.",
      });

      setShowUpdateConfirmation(false);
      return;
    }
    setShowUpdateConfirmation(true);
  };

  const clearForm = () => {
    setFormData({
      type: "USER",
      status: "ONBOARD",
      fcmToken: "",
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
      type: "success",
      content: "Form cleared successfully.",
    });
  };

  const handleConfirmation = async () => {
    setShowUpdateConfirmation(false); // Close the confirmation dialog
    console.log(formData);
    try {
      setIsLoading(true);

      const response = await axios.post(`${baseUrl}/users/sign-up`, formData);
      setMessage({
        type: "success",
        content: "User successfully added to the system",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      console.log(error.response.data.message);

      if (
        error.response.data.status == 409 &&
        error.response.data.message.includes("Email already exist")
      ) {
        setMessage({
          type: "error",
          content: "Existing email .Enter a new email",
        });
        setShowUpdateConfirmation(false);
        return;
      }

      if (
        error.response.data.status == 409 &&
        error.response.data.message.includes("Mobile number already exist.")
      ) {
        setMessage({
          type: "error",
          content: "Existing mobile number .Enter a new mobile number",
        });
        setShowUpdateConfirmation(false);
        return;
      }

      if (
        error.response.data.status == 409 &&
        error.response.data.message.includes(
          "Duplicate mobile numbers are not allowed."
        )
      ) {
        setMessage({
          type: "error",
          content: "Existing mobile number .Enter a new mobile number",
        });
        setShowUpdateConfirmation(false);
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };
  const userType = localStorage.getItem("user_type");

  const renderUserOnboarding = () => {
    if (userType === "USER") {
      return (
        <div className="">
          <Navbar />

          <FcmTokenComp />
          <div className="mb-10 py-10 px-0 w-full ">
            <div className="flex flex-col mt-32 ml-20 mr-20 border border-gray-300 shadow-md">
              <div className="text-3xl ml-5 font-semibold mb-5 mt-10 ml-10">
                User Details
              </div>
            </div>
          </div>
        </div>
      );
    } else if (userType === "ADMIN") {
      return (
        <div className="">
          <Navbar />
          {isLoading && <PageLoading />}
          {message.content && (
            <Alert
              type={message.type}
              content={message.content}
              onClose={() => setMessage({ type: "", content: "" })}
            />
          )}

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
                      onClick={() => {
                        handleConfirmation();
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

          <div className="mb-10 py-10  ">
            <form className="max-w-screen-full min-w-screen-full ml-1 " onSubmit={handleSubmit}>
              <div className="flex flex-col mt-32 ml-10 mr-10 border border-gray-300 shadow-md ">
                <div className="text-2xl ml-5 font-semibold mb-5 mt-10 ml-10 md:text-3xl">
                  User Onboarding
                </div>
                <div className="text-lg ml-10 mb-10">
                  User details for user registration.
                </div>
                <div>
                  <div className="flex flex-wrap mb-6 px-10">
                    <div className="w-full mb-6 md:mb-0">
                      <label className="block text-gray-700 text-lg font-semibold mb-2">
                        Basic Details
                      </label>
                      <input type="hidden" value="USER" name="type" />
                      <input type="hidden" value="ONBOARD" name="status" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16">
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
                          className="w-full md:w-auto text-gray-700 border border-gray-400 rounded py-3 px-6 mb-3 leading-tight focus:outline-none focus:bg-white"
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
                          <option value="" disabled className="text-gray-700 ">
                            Gender
                          </option>
                          <option value="MALE">MALE</option>
                          <option value="FEMALE">FEMALE</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap mb-10 px-10">
                    <div className="w-full mb-6 md:mb-0">
                      <label className="block text-gray-700 text-lg font-semibold mb-2">
                        Contact Details
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16">
                        <input
                          className="w-full md:w-auto text-gray-700 border border-gray-400 rounded py-3 px-6 mb-3 leading-tight focus:outline-none focus:bg-white"
                          id="grid-email"
                          type="text"
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

                        <input
                          className="w-full md:w-auto text-gray-700 border border-gray-400 rounded py-3 px-6 mb-3 leading-tight focus:outline-none focus:bg-white"
                          id="grid-email"
                          type="text"
                          name="password"
                          value={formData.auth_info.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              auth_info: {
                                ...formData.contact_info,
                                password: e.target.value,
                              },
                            })
                          }
                          placeholder="Password"
                        />


                        {formData.contact_info.mobile_numbers.map(
                          (number, index) => (
                            <div key={index} className="flex items-center mb-3">
                              <div className="flex-grow flex items-center">
                                <input
                                  className="w-full text-gray-700 border border-gray-400 rounded py-3 px-6 leading-tight focus:outline-none focus:bg-white"
                                  type="text"
                                  name={`mobile_number_${index}`}
                                  value={number}
                                  onChange={(e) => handleChange(e, index)}
                                  placeholder="Mobile Number"
                                />
                                {index === 0 && (
                                  <button
                                    type="button"
                                    className="absolute right-[50px] inline-flex font-light rounded-lg bg-white text-3xl "
                                    onClick={handleAddMobileField}
                                  >
                                    +
                                  </button>
                                )}
                                {index > 0 && (
                                  <div className="inline-flex items-center ml-0">
                                    <button
                                      type="button"
                                      className="absolute ml-3 font-light rounded-lg bg-white text-3xl "
                                      onClick={() =>
                                        handleRemoveMobileField(index)
                                      }
                                    >
                                      -
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3  ml-5 mr-5 md:ml-36 md:mr-16 flex flex-col md:flex-row gap-y-4 md:gap-x-10 justify-end mb-10">
                  <button
                    type="button"
                    className="w-full ms:w-[150px] md:w-[200px]  py-2 px-4 md:py-3 md:px-6 inline-flex items-center justify-center gap-x-2 text-sm md:text-base font-semibold rounded-lg border border-mainColor bg-white text-mainColor hover:bg-blue-100 focus:border-mainColor focus:outline-none active:border-mainColor active:outline-none"
                    onClick={clearForm}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="w-full md:w-[200px] py-2 px-4 md:py-3 md:px-6 inline-flex items-center justify-center gap-x-2 text-sm md:text-base font-semibold rounded-lg border border-transparent bg-mainColor text-white hover:bg-lightColor focus:border-transparent focus:outline-none active:border-transparent active:outline-none"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <div>{/* Render default content if user type is not specified */}</div>
      );
    }
  };

  return <div>{renderUserOnboarding()}</div>;
}
