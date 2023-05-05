import React from "react";

import Header from "../components/MainNavbar";
import Footer from "../components/Footer";
import MainCarousel from "../components/carousel/MainCarousel";

import "../styles/pages/mainpage.css";

function Main() {

  return (
    <div className="top-container">
      <Header />
      <div className="body-wrapper">
        <MainCarousel />
      </div>
      <Footer />
    </div>
  );
}

export default Main;
