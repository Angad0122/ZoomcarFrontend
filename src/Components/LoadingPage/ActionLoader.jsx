import React from "react";
import MoonLoader from "react-spinners/MoonLoader";

function ActionLoader() {
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
            background-color: rgba(0, 0, 0, 0.7); /* 50% Transparent */
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9999; /* Ensure it stays on top */
          }
        `}
      </style>
      <div className="loader-container">
        <MoonLoader color={"#0047ff"} size={60} />
      </div>
    </>
  );
}

export default ActionLoader;
