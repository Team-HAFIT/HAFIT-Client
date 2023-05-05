import React from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";

import MainHeader from "../components/MainNavbar";
import MyFooter from "../components/Footer";
import MainCarousel from "../components/carousel/MainCarousel";

import "../styles/pages/mainpage.css";

function LoginMain() {
  return (
    <div className="top-container">
      <MainHeader />
      <div className="body-wrapper">
        <MainCarousel />
        <div>
          <Row justify="center">
            <Col span={8}>
              <Link to="/squat/setting">
                <h2>스쿼트</h2>
                <p>스쿼트 메뉴가 들어갈 부분입니다.</p>
              </Link>
            </Col>
            <Col span={8}>
              <h2>데드리프트</h2>
              <p>데드리프트 메뉴가 들어갈 부분입니다.</p>
            </Col>
            <Col span={8}>
              <h2>벤치프레스</h2>
              <p>벤치프레스 메뉴가 들어갈 부분입니다.</p>
            </Col>
          </Row>
        </div>
      </div>
      <MyFooter />
    </div>
  );
}

export default LoginMain;
