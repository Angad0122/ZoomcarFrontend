import React from "react";
import MoonLoader from "react-spinners/MoonLoader";

function MainLoader() {
  return (
    <>
      <style>
        {`
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh; /* Full viewport height */
            width: 100vw; /* Full viewport width */
            background-color: #f9f9f9; /* Optional: Add a background color */
          }
        `}
      </style>
      <div className="loader-container">
        <MoonLoader color={"#0047ff"} size={60} />
      </div>
    </>
  );
}

export default MainLoader;
