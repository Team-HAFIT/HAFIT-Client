import React from "react";

// import { Link } from "react-router-dom";

// import MainHeader from "../components/MainNavbar";

import PreparingImg from "../assets/img/coming-soon-sunrise-dark.jpg";

import "../styles/pages/preparingPage.css";

function PreparingPage() {
  return (
    <React.Fragment>
      {/* <MainHeader /> */}
      <div className="no-content">
        <img src={PreparingImg} alt="준비 중인 페이지입니다." />
      </div>
    </React.Fragment>
  );
}

export default PreparingPage;
