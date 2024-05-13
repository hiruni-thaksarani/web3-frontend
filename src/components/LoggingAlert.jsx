// LoggingAlert.jsx

import React from "react";
import { IconAlertCircle, IconCircleCheck } from "@tabler/icons-react";

const LoggingAlert = ({ type, content, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center mb-[800px]">
      <div
        className={`bg-${
          type === "success" ? "green" : "red"
        }-100 border-${
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

export default LoggingAlert;
