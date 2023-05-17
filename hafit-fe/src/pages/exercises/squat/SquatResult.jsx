import React from "react";
import { Button, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";

import "../../../styles/pages/squatResult.css";

// import MainHeader from "../../../components/MainNavbar";

import SquatMuscle from "../../../assets/img/squat_muscle.png";

const { Title } = Typography;

const SquatResult = () => {
  const currentDate = new Date();
  const currentDateString = `${currentDate.getFullYear()}. ${
    currentDate.getMonth() + 1
  }. ${currentDate.getDate()} - ${currentDate.getHours()}:${currentDate.getMinutes()}`;

  return (
    <div className="exec-result" style={{backgroundColor: "#360d57", height:"100vh"}}>
      {/* <MainHeader /> */}
      <Row justify="center" style={{ marginTop: "24px" }}>
        <Col>
          <Title level={1} style={{ textAlign: "center", color:"white" }}>
            운동 목표를 달성했어요! 🎉
          </Title>
        </Col>
      </Row>
      <Row justify="center" align="middle"
          style={{backgroundColor: "rgb(20, 20, 20)", borderRadius: "6rem", maxWidth: "70vw", margin: "auto" }}>
        <Col xs={20} md={20}>
          <Row justify="center" align="middle" style={{ minHeight: "500px" }}>
            <Col xs={0} md={8} >
              <div>
                <img src={SquatMuscle} alt="사진.스쿼트 자극 부위" 
                style={{
                  height: "360px",
                  width: "280px"
                }} />
              </div>
            </Col>
            <Col xs={24} md={16}>
              <div style={{ textAlign: "left", color: "white", marginLeft:"40px", height: "100%", borderLeft: "1px solid #eeeeee", paddingLeft: "40px" }}>
                <Title level={2} style={{color: "white", marginBottom: "4px", fontWeight: "bold" }}>스쿼트 <span style={{fontSize: "18px", margin: "0 4px"}}>| Squat</span></Title>
                <p style={{margin: 0 }}>{currentDateString}</p>
                <p><span style={{fontSize: "40px", marginRight: "6px",fontWeight: "500"}}>5</span>개 
                <span style={{fontSize: "40px", margin: "0 10px"}}>/</span> 
                <span style={{fontSize: "40px", marginRight: "6px",fontWeight: "500"}}>1</span>세트 
                <span style={{fontSize: "32px", fontWeight:"250", margin: "0 24px"}}> 총 5개 </span></p>
                {/* <p className="exercise-result-time">운동 시간 00 : 0 : 30</p> */}
                <p style={{margin: "32px 0"}}>
                  <span style={{fontSize: "16px", marginRight: "12px"}}>소모 칼로리</span><span style={{fontSize: "28px", fontWeight:"550", marginRight: "10px"}}>15</span><span style={{fontSize:"16px"}}>kcal</span>
                </p>
                <p style={{margin: "32px 0"}}>
                <span style={{fontSize: "16px", marginRight: "12px"}}>중량</span><span style={{fontSize: "28px", fontWeight:"550", marginRight: "10px"}}>0</span><span style={{fontSize:"16px"}}>kg</span>
                </p>
                <p style={{margin: "32px 0"}}>
                <span style={{fontSize: "16px", marginRight: "12px"}}>운동 강도</span>
                <span style={{fontSize: "28px", marginRight: "24px"}}>😢</span>
                <span style={{fontSize: "28px", marginRight: "24px"}}>🙁</span>
                <span style={{fontSize: "28px", marginRight: "24px"}}>😐</span>
                <span style={{fontSize: "28px", marginRight: "24px"}}>🙂</span>
                <span style={{fontSize: "28px", marginRight: "24px"}}>😃</span>
                </p>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row justify="center">
        <Col>
          <div style={{ marginTop: "24px" }}>
            <Button type="primary" 
            style={{ marginRight: "12px", width:"150px", height: "48px", backgroundColor: "#212325", fontSize:"18px", fontWeight: "600", borderRadius: "16px" }}>
              <Link to="/mainpage">
                홈으로
              </Link>
            </Button>
            <Button type="primary"
            style={{ marginRight: "12px", width:"150px", height: "48px", backgroundColor: "#c1eaca", color:"black", fontSize:"18px", fontWeight: "700", borderRadius: "16px" }}>
              <Link to="/prepare">
                결과 자세히 보기
              </Link>
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SquatResult;
