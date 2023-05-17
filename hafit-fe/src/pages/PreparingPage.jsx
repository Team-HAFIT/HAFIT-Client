import React from "react";

// import { Link } from "react-router-dom";

// import MainHeader from "../components/MainNavbar";

import NoContent from "../assets/img/no_content.jpg";

import "../styles/pages/preparingPage.css";

function PreparingPage() {
  return (
    <div>
        {/* <MainHeader /> */}
        <div className="no-content">
            <img src={NoContent} alt="준비중" style={{width: "100%"}}/>
        </div>     
        <div>

        </div>
    </div>
  );
}

export default PreparingPage;
