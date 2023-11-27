import React from "react";
import SBWhite from "../../img/status-bar-white.svg";
import SBBlack from "../../img/status-bar-black.svg";
import "./index.css";

type StatusBarProps = {
  type: "black" | "white";
};

const StatusBar: React.FC<StatusBarProps> = ({ type }) => {
  let src = "";

  if (type === "black") {
    src = SBBlack; // Set source based on color prop
  } else if (type === "white") {
    src = SBWhite; // Set source based on color prop
  }

  return <img src={src} alt="Status bar" className="status-bar" />;
};

export default StatusBar;
