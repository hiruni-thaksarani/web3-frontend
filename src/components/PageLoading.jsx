import React from "react";
import {FadeLoader} from "react-spinners";

function PageLoading(){
    return(
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-gray-300 bg-opacity-50 min-h-[100vh]">
            <FadeLoader color="rgba(39, 35, 224, 1)" />
        </div>
    );
}

export default PageLoading;