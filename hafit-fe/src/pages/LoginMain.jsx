import React from "react";
import { Card, Row, Col } from "antd";
// import { Link } from "react-router-dom";

// import MainHeader from "../components/MainNavbar";
import MyFooter from "../components/Footer";
import MainCarousel from "../components/carousel/MainCarousel";

import "../styles/pages/mainpage.css";

const data = [
  {
    title: "스쿼트",
    description: "운동하러 가기",
    image: "https://via.placeholder.com/150/eeeeee/ffffff?text=placeholder+image",
    link: "/squat/setting",
  },
  {
    title: "데드리프트",
    description: "준비 중입니다.",
    image: "https://via.placeholder.com/150/eeeeee/ffffff?text=placeholder+image",
    link: "/prepare",
  },
  {
    title: "벤치프레스",
    description: "준비 중입니다.",
    image: "https://via.placeholder.com/150/eeeeee/ffffff?text=placeholder+image",
    link: "/prepare",
  },
];

function LoginMain() {
  return (
    <div className="top-container">
      {/* <MainHeader /> */}
      <div className="body-wrapper">
        <MainCarousel />
        <div style={{marginTop: "16px"}}>
          <Row gutter={[16, 16]} style={{ margin: "0 auto" }}>
            {data.map((item, index) => (
              <Col xs={24} sm={12} md={8} lg={8} key={index}>
              <div style={{ position: "relative" }}>
                <Card hoverable cover={<img alt={item.title} src={item.image} />} onClick={() => (window.location.href = item.link)}>
                  <div style={{ position: "absolute", top: 40, left: 0, right: 0, backgroundColor: "rgba(0, 0, 0, 0.1)", color: "#fff", padding: "1rem", textAlign: "center", borderRadius: "16px", margin: "1rem" }}>
                    <Card.Meta title={<span style={{fontSize: "1.4rem"}}>{item.title}</span>} description={item.description} />
                  </div>
                </Card>
              </div>
            </Col>
            ))}
          </Row>
          {/* <Row justify="center">
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
          </Row> */}
        </div>
      </div>
      <MyFooter />
    </div>
  );
}

export default LoginMain;
