"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { redirect } from "next/navigation";
import { IconRefresh } from "@tabler/icons-react";
import { IconAlertCircle, IconCircleCheck } from "@tabler/icons-react";
import { IconCircleLetterX } from "@tabler/icons-react";
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";


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

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // State for showing the confirmation box
  const [showAConfirmAlert, setShowConfirmAlert] = useState(false); // State for showing the confirmation box
  const [showDConfirmAlert, setShowDeleteConfirmAlert] = useState(false); 
  const [originalEmail, setOriginalEmail] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [errorAlertContent, setErrorAlertContent] = useState(""); // State for error alert message
  const baseUrl=process.env.NEXT_PUBLIC_BASE_URL;
  const [fcmToken1, setFcmToken] = useState('');


  useEffect(() => {
      const fetchFcmToken = async () => {
          const FCM = localStorage.getItem('fcmToken');
        setFcmToken(FCM);
      };
      fetchFcmToken();
    }, []);

  const [darkBackground, setDarkBackground] = useState(false); // state for controlling dark background

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const fetchUsers = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/"; // Redirect to root URL
    return;
  }

  try {
    const response = await axios.get(`${baseUrl}/users/getUsers`, {
      headers: {
        Authorization: token,
      },
    });

    const sortedUsers = response.data.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setUsers(sortedUsers);
    setOriginalEmail(sortedUsers.map(user => user.contact_info.email));
  } catch (error) {
    console.error("Error retrieving users:", error);
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (redirectToHome) {
      redirect("./");
    }
  }, [redirectToHome]);

  const handleEdit = (userId) => {
    setEditUserId(userId);
    setShowEditForm(true);
    setShowAlert(false);
    const userToEdit = users.find((user) => user._id === userId);
    setEditedUser(userToEdit);
    // Find the original email based on userId
    const originalEmail = users.find(user => user._id === userId).contact_info.email;
    setOriginalEmail(originalEmail);
  };

  const handleDelete = (userEmail,userId) => {
    setSelectedUserEmail(userEmail);
    setSelectedUserId(userId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.patch(
        `${baseUrl}/users/deactivate/${selectedUserEmail}`
      );
      setShowDeleteConfirmAlert(true);
      fetchUsers();
      console.log("User Id - "+selectedUserId);
      console.log("Fcm Token - "+fcmToken1);

          const notificationResponse = await axios.post(`${baseUrl}/notifications/send`, {
            // userId:selectedUserId.toString(),
            // token:fcmToken1,
            userId:"6649c31061ac5b0f0a4ad512",
            token:"eh0qSX70YStXRHYhMi-a3Q:APA91bFltpksj8YyoTQGy5IS04bJ0OtPeoGej0PYRT4K5MTOfvVCJWRmloRWGw5OmYS9DjPUydj1R6x6bFL2oer1ngZHGwf7fY9hGGWF0ZZ554gmEzAaKDyM-AixrhC39E1GFxyQDC5L",
          });

          if (notificationResponse.status === 201) {
            console.log('Notification sent successfully');
            console.log(notificationResponse);
          } else {
            console.error('Failed to send notification');
            console.log(notificationResponse);
          }

      // setShowAlertDelete(true);
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Check if the input is a mobile number input
    if (name.startsWith("mobile_number_")) {
      const index = parseInt(name.split("_")[2]); // Extract the index from the input name
      setEditedUser((prevState) => ({
        ...prevState,
        contact_info: {
          ...prevState.contact_info,
          mobile_numbers: prevState.contact_info.mobile_numbers.map((number, i) =>
            i === index ? value : number  // Update the value at the corresponding index
          ),
        },
      }));
    } else {
      // If it's not a mobile number input, update the other fields normally
      setEditedUser((prevState) => ({
        ...prevState,
        basic_info: {
          ...prevState.basic_info,
          [name]: value,
        },
        contact_info: {
          ...prevState.contact_info,
          [name]: value,
        },
      }));
    }
  };
  

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
  
//     // Validation for first name
//     const firstNameRegex = /^[a-zA-Z\s]{1,15}$/; // Allows alphabets and spaces, max 15 characters
//     if (!firstNameRegex.test(editedUser.basic_info.first_name)) {
//       alert("First name is invalid");
//       return;
//     }
  
//     // Validation for last name
//     const lastNameRegex = /^[a-zA-Z\s]{1,15}$/; // Allows alphabets and spaces, max 15 characters
//     if (!lastNameRegex.test(editedUser.basic_info.last_name)) {
//       alert("Last name is invalid");
//       return;
//     }
  
//     // Validation for mobile numbers
//     const mobileNumberRegex = /^\d{1,25}$/; // Allows digits only, max 25 characters
//     for (const number of editedUser.contact_info.mobile_numbers) {
//       if (!mobileNumberRegex.test(number)) {
//         alert("Mobile number is invalid");
//         return;
//       }
//     }
  
//     setShowEditForm(true); // Hide the edit form temporarily
  
//     // Display the confirmation box
//     setShowConfirmation(true);
//   };


const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Validation for first name
    const firstNameRegex = /^[a-zA-Z\s]{1,25}$/; // Corrected regex, allows alphabets and spaces, max 25 characters
    if (!firstNameRegex.test(editedUser.basic_info.first_name)) {
      setErrorAlertContent("Please provide valid first name (maximum 25 characters, only letters allowed)");
      setShowAlert(true);
      return;
    }

    // Validation for last name
    const lastNameRegex = /^[a-zA-Z\s]{1,25}$/; // Corrected regex, allows alphabets and spaces, max 25 characters
    if (!lastNameRegex.test(editedUser.basic_info.last_name)) {
      setErrorAlertContent("Please provide valid last name (maximum 25 characters, only letters allowed)");
      setShowAlert(true);
      return;
    }

    const emailRegex=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!emailRegex.test(editedUser.contact_info.email)) {
        setErrorAlertContent("Please provide valid email");
        setShowAlert(true);
        return;
      }


    setShowConfirmation(true); 
  };
  

  const confirmEdit = async () => {
    try {
      await axios.patch(
        `${baseUrl}/users/${originalEmail}`,
        editedUser
      );
      fetchUsers();
      setShowConfirmAlert(true); // Show the alert after successful update
    } catch (error) {
      console.error("Error updating user:", error);


      console.log(error.response.data.error.status);
      console.log(error.response.data.error.message);

      

      if(error.response.data.error.status==409 && error.response.data.error.message.includes("Existing email")){
        setErrorAlertContent("Existing email.Enter a new email");
      setShowAlert(true);
      setShowConfirmation(false); 
      return;
      }

      if(error.response.data.error.status==400 && error.response.data.error.message.includes("Mobile number already exist.")){
        setErrorAlertContent("Existing mobile number .Enter a new mobile number")
        setShowAlert(true)
        setShowConfirmation(false); 
        return;
      }


      if(error.response.data.status==409 && error.response.data.message.includes("Duplicate mobile numbers are not allowed.")){
        setErrorAlertContent("Duplicate mobile numbers are not allowed.")
        setShowAlert(true);
        setShowConfirmation(false); 
        return;
      }

      if(error.response.data.error.status==409 && error.response.data.error.message.includes("Duplicate mobile numbers are not allowed.")){
        setErrorAlertContent("Duplicate mobile numbers are not allowed.")
        setShowAlert(true);
        setShowConfirmation(false); 
        return;
      }

      if(error.response.data.error.status==409 && error.response.data.error.message.includes("Mobile number already exist.")){
        setErrorAlertContent("Mobile number already exist.")
        setShowAlert(true);
        setShowConfirmation(false); 
        return;
      }

      if(error.response.data.error.status==409 && error.response.data.error.message.includes("Maximum length for a mobile number is 15.")){
        setErrorAlertContent("Maximum length for a mobile number is 15.")
        setShowAlert(true);
        setShowConfirmation(false); 
        return;
      }

    }
  };

  const [message, setMessage] = useState({
    type: "",
    content: "",
  });
  

  useEffect(() => {
    const logoutTimeout = setTimeout(() => {
      handleLogout();
    }, 30 * 60 * 1000);

    return () => clearTimeout(logoutTimeout);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div>
     
        <Navbar />
        {showAlert && <Alert type="error" content={errorAlertContent} onClose={() => setShowAlert(false)} />}

     
      <div className="flex flex-col mt-40 ml-20 mr-20 py-5 px-5 border border-gray-300 shadow-md pb-10 mb-20">
        <h1 className="text-3xl font-semibold my-4 ml-10 mb-10">User List</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full text-left border-gray-100">
            <thead className="dark:border-neutral-900 bg-blue-100 font-light">
              <tr>
                <th className="px-4 py-4 font-light text-sm">First Name</th>
                <th className="px-4 py-2 font-light text-sm">Last Name</th>
                <th className="px-4 py-2 font-light text-sm">Date of Birth</th>
                <th className="px-4 py-2 font-light text-sm">Gender</th>
                <th className="px-4 py-2 font-light text-sm">Contact Number</th>
                <th className="px-4 py-2 font-light text-sm">Email</th>
                <th className="px-4 py-2 font-light text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <React.Fragment key={user._id}>
                  <tr
                    className={
                      user.status === "INACTIVE"
                        ? "bg-red-100"
                        : "hover:bg-neutral-100"
                    }
                  >
                    <td className="px-4 py-4 font-light text-sm">
                      {user.basic_info.first_name}
                    </td>
                    <td className="px-4 py-4 font-light text-sm">
                      {user.basic_info.last_name}
                    </td>
                    <td className="px-4 py-2 font-light text-sm">
                      {formatDate(user.basic_info.dob)}
                    </td>
                    <td className="px-4 py-2 font-light text-sm">
                      {user.basic_info.gender}
                    </td>
                    <td className="px-4 py-2 font-light text-sm">
                      {user.contact_info.mobile_numbers.length > 0
                        ? user.contact_info.mobile_numbers[0]
                        : "5467798689"}
                    </td>

                    <td className="px-4 py-2 font-light text-sm">
                      {user.contact_info.email}
                    </td>
                    <td className="px-4 py-2 font-light">
                      {user.status === "INACTIVE" ? (
                        <div className="bg-red-600 text-white text-center py-1 text-xs  w-20">
                          INACTIVE
                        </div>
                      ) : (
                        <div className="flex">
                          <IconRefresh
                            icon={faEdit}
                            onClick={() => handleEdit(user._id)}
                            className="cursor-pointer text-green-600"
                          />
                          <IconCircleLetterX
                            onClick={() =>
                              handleDelete(user.contact_info.email,user._id)
                            }
                            className="cursor-pointer text-red-500 ml-3"
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                  {index !== users.length - 1 && (
                    <tr>
                      <td colSpan="7" className="border-t border-gray-300"></td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center z-30 w-full">
          
          <div className="fixed ml-0 inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 h-screen ">
            <div className="bg-white p-8 rounded-md w-[500px] py-16 ">
              <h2 className="text-lg font-semibold mb-10">User Details</h2>
              <form onSubmit={(e) => handleEditSubmit(e)}>
                <div className="mb-8 relative">
                  <label
                    htmlFor="firstName"
                    className="absolute top-0 left-2 -mt-2 bg-white px-1 text-xs text-gray-500"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="first_name"
                    value={editedUser.basic_info.first_name}
                    onChange={handleInputChange}
                    className="px-5 py-4 mt-1  focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border rounded-md border-gray-300 transition-colors duration-200"
                    onFocus={(e) => e.target.classList.add("border-blue-500")}
                    onBlur={(e) => e.target.classList.remove("border-blue-500")}
                  />
                </div>

                <div className="mb-8 relative">
                  <label
                    htmlFor="lastName"
                    className="absolute top-0 left-2 -mt-2 bg-white px-1 text-xs text-gray-500"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="last_name"
                    value={editedUser.basic_info.last_name}
                    onChange={handleInputChange}
                    className="px-5 py-3 mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border rounded-md border-gray-300 transition-colors duration-200"
                    onFocus={(e) => e.target.classList.add("border-blue-500")}
                    onBlur={(e) => e.target.classList.remove("border-blue-500")}
                  />
                </div>

                <div className="mb-8 relative">
                  <label
                    htmlFor="dob"
                    className="absolute top-0 left-2 -mt-2 bg-white px-1 text-xs text-gray-500"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    id="dob"
                    name="dob"
                    value={formatDate(editedUser.basic_info.dob)}
                    onChange={handleInputChange}
                    className="px-5 py-3 mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border rounded-md border-gray-300 transition-colors duration-200"
                    onFocus={(e) => e.target.classList.add("border-blue-500")}
                    onBlur={(e) => e.target.classList.remove("border-blue-500")}
                  />
                </div>

                <div className="mb-8 relative">
                  <label
                    htmlFor="gender"
                    className="absolute top-0 left-2 -mt-2 bg-white px-1 text-xs text-gray-500"
                  >
                    Gender
                  </label>
                  <input
                    type="text"
                    id="gender"
                    name="gender"
                    value={editedUser.basic_info.gender}
                    onChange={handleInputChange}
                    className="px-5 py-3 mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border rounded-md border-gray-300 transition-colors duration-200"
                    onFocus={(e) => e.target.classList.add("border-blue-500")}
                    onBlur={(e) => e.target.classList.remove("border-blue-500")}
                  />
                </div>

                <div className="mb-8 relative">
                  <label
                    htmlFor="mobileNumbers"
                    className="absolute top-0 left-2 -mt-2 bg-white px-1 text-xs text-gray-500"
                  >
                    Contact Numbers
                  </label>
                  {editedUser.contact_info.mobile_numbers.map(
                    (number, index) => (
                      <input
                        key={index}
                        type="text"
                        id={`mobile_number_${index}`}
                        name={`mobile_number_${index}`}
                        value={number}
                        onChange={handleInputChange}
                        className="px-5 py-3 mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border rounded-md border-gray-300 transition-colors duration-200"
                        onFocus={(e) =>
                          e.target.classList.add("border-blue-500")
                        }
                        onBlur={(e) =>
                          e.target.classList.remove("border-blue-500")
                        }
                      />
                    )
                  )}
                </div>

                <div className="mb-8 relative">
                  <label
                    htmlFor="email"
                    className="absolute top-0 left-2 -mt-2 bg-white px-1 text-xs text-gray-500"
                  >
                    Email
                  </label>
                  <input
                    type="string"
                    id="email"
                    name="email"
                    value={editedUser.contact_info.email}
                    onChange={handleInputChange}
                    className="px-5 py-3 mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border rounded-md border-gray-300 transition-colors duration-200"
                    onFocus={(e) => e.target.classList.add("border-blue-500")}
                    onBlur={(e) => e.target.classList.remove("border-blue-500")}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="mr-2 px-10 py-3 text-sm font-medium text-mainColor border border-mainColor  "
                  >
                    Cancel
                  </button>
                  <button 
                  type="submit"
                  onClick={() => {
                    // setShowConfirmation(true); 
                    // setShowEditForm(true);
                  }}
                  className="px-10 ml-5 py-3 text-sm font-medium text-white bg-mainColor  hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white w-[450px] relative z-10">
            <div className="flex items-center text-lg py-5 pl-5 pr-10 font-semibold mb-4 bg-orange-500 text-white">
              <div className="mr-2">
                <IconAlertCircle className="text-white" />
              </div>
              <div>Warning</div>
            </div>
            <p className="ml-10 mt-10">
              Are you sure you want to deactivate user?
            </p>
            <div className="flex justify-center mt-4 p-5 mb-5">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="mr-2 px-7 py-1 text-sm font-medium text-orange-500 ml-32 border border-orange-500 border-solid focus:outline-none "
              >
                No
              </button>
              <button
                
                onClick={() => {
                    confirmDelete(); 
                  }}
                className="px-7 py-1 mr-3 ml-5 text-sm font-medium text-white bg-orange-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {showAlertDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-green-100 p-5 rounded-md w-[500px] mb-[770px] h-[65px]">
            <div className="flex items-center ">
              <div className="mr-2">
                <IconCircleCheck className="text-green-700" />
              </div>
              <div className="mr-2">
                <p className="text-sm mr-16 ">
                  User has been deactivated successfully.
                </p>
              </div>
              <div>
                <button
                  onClick={() => {
                    
                    setShowAlert(true); // Close the alert
                    showDeleteConfirmation(false); // Close the confirmation box
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

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white w-[450px] relative z-10">
            <div className="flex items-center text-lg py-5 pl-5 pr-10 font-semibold mb-4 bg-mainColor text-white">
              <div className="mr-2">
                <IconAlertCircle className="text-white" />
              </div>
              <div>Confirmation</div>
            </div>
            <p className="ml-10 mt-10">Are you sure to update?</p>
            <div className="flex justify-center mt-4 p-5 mb-5">
              <button
                onClick={() => {
                    setShowConfirmation(false);
                    setShowEditForm(false)
                }}
                className="mr-2 px-7 py-1 text-sm font-medium text-mainColor ml-32 border border-mainColor border-solid focus:outline-none "
              >
                No
              </button>
              <button
                type="submit"
                onClick={()=>{
                    confirmEdit()}}
                className="px-7 py-1 mr-3 ml-5 text-sm font-medium text-white bg-mainColor "
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {showAConfirmAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-40">
          <div className="bg-green-100 p-5 rounded-md w-[500px] mb-[770px] h-[65px]">
            <div className="flex items-center ">
              <div className="mr-2">
                <IconCircleCheck className="text-green-700" />
              </div>
              <div className="mr-2">
                <p className="text-sm mr-16 ">
                  User has been updated successfully.
                </p>
              </div>
              <div>
                <button
                  onClick={() => {
                    setShowConfirmAlert(false);
                    setShowConfirmation(false);
                    setShowEditForm(false);
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

{showAConfirmAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-40">
          <div className="bg-green-100 p-5 rounded-md w-[500px] mb-[770px] h-[65px]">
            <div className="flex items-center ">
              <div className="mr-2">
                <IconCircleCheck className="text-green-700" />
              </div>
              <div className="mr-2">
                <p className="text-sm mr-16 ">
                  User has been updated successfully.
                </p>
              </div>
              <div>
                <button
                  onClick={() => {
                    setShowConfirmAlert(false);
                    setShowConfirmation(false);
                    setShowEditForm(false);
                  }}
                  className="inline-flex items-center mr-1 ml-16 text-sm font-bold rounded-lg border border-transparent text-black"
                >
                  X
                </button>
              </div>
            </div>
          </div>
        </div>

      )}{showDConfirmAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-40">
          <div className="bg-green-100 p-5 rounded-md w-[500px] mb-[770px] h-[65px]">
            <div className="flex items-center ">
              <div className="mr-2">
                <IconCircleCheck className="text-green-700" />
              </div>
              <div className="mr-2">
                <p className="text-sm mr-16 ">
                  User has been deleted successfully.
                </p>
              </div>
              <div>
                <button
                  onClick={() => {
                    setShowDeleteConfirmation(false);
                    setShowDeleteConfirmAlert(false);
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

    </div>
  );
}
