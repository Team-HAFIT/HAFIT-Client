import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios"; // axios 호출
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "../../../styles/pages/squatResult.css";

// import MainHeader from "../../../components/MainNavbar";

import SquatMuscle from "../../../assets/img/squat_muscle.png";

const { Title } = Typography;

const SquatResult = () => {
  const accessToken = useSelector((state) => state.authToken.accessToken); // 액세스 토큰 생성
  const navigate = useNavigate(); // 페이지 이동을 위해 useNavigate hook 사용
  const location = useLocation();
  const planId = location.state.planId;
  const [set, setSet] = useState(0); // 세트 수
  const [count, setCount] = useState(0); // 카운트 수
  const [time, setTime] = useState(0); // 소모 시간(몇초 기준)
  const [weight, setWeight] = useState(0); // 무게
  const [forceRender, setForceRender] = useState(false); // 렌더링을 강제로 발생시킬 상태 추가
  const [calorie, setCalorie] = useState(0);
  const currentDate = new Date();
  const currentDateString = `${currentDate.getFullYear()}. ${
    currentDate.getMonth() + 1
  }. ${currentDate.getDate()} - ${currentDate.getHours()}:${currentDate.getMinutes()}`;

  useEffect(() => {
    axios // planId로 플랜 계획 조회해오기
      .get(`/api/sets/all/${planId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000,
      })
      .then((response) => {
        const listData = response.data; // 서버에서 전달된 JSON 배열을 변수에 할당합니다.

        const item = listData[listData.length - 1];
        setWeight(item.weight);
        setCount(item.realCount);
        setSet(item.realSet);
        setTime(item.realTime);
        axios.get('/api/my', {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          timeout: 10000,
        })
        .then((res) => {
          const list = res.data;
          let mHeight = list.height;
          let mWeight = list.weight;
          console.log(mHeight);
          console.log(mWeight);
          if (list.height === null || list.weight === null) {
            mHeight = 70;
            mWeight = 70;
            console.log(mHeight);
            console.log(mWeight);
          }
          console.log(item.weight);
          console.log(item.realCount);
          console.log(item.realSet);
          console.log(item.realTime);
          setCalorie(parseInt(((6.0 + (0.1 * item.weight / mWeight) * 3.5 * mWeight / 200) * (item.realCount * item.realSet * (item.realTime/60)))));
          console.log(parseInt(((6.0 + (0.1 * item.weight / mWeight) * 3.5 * mWeight / 200) * (item.realCount * item.realSet * (item.realTime/60)))));
        })
        setForceRender(true); // 렌더링을 강제로 발생시킬 상태를 true로 설정
      })
      .catch((error) => {
        console.log(error);
      });
  }, [planId]);

  useEffect(() => {
    if (forceRender) {
      setForceRender(false); // 렌더링을 강제로 발생시키는 상태를 다시 false로 설정
    }
  }, [forceRender]);

  function handleHome() {
    navigate("/mainpage");
  }

  function handleStats() {
    navigate("/stats");
  }

  return (
    <div
      className="exec-result"
      style={{ backgroundColor: "#360d57", height: "100vh" }}
    >
      {/* <MainHeader /> */}
      <Row justify="center" style={{ marginTop: "24px" }}>
        <Col>
          <Title level={1} style={{ textAlign: "center", color: "white" }}>
            운동 목표를 달성했어요! 🎉
          </Title>
        </Col>
      </Row>
      <Row
        justify="center"
        align="middle"
        style={{
          backgroundColor: "rgb(20, 20, 20)",
          borderRadius: "6rem",
          maxWidth: "70vw",
          margin: "auto",
        }}
      >
        <Col xs={20} md={20}>
          <Row justify="center" align="middle" style={{ minHeight: "500px" }}>
            <Col xs={0} md={8}>
              <div>
                <img
                  src={SquatMuscle}
                  alt="사진.스쿼트 자극 부위"
                  style={{
                    height: "360px",
                    width: "280px",
                  }}
                />
              </div>
            </Col>
            <Col xs={24} md={16}>
              <div
                style={{
                  textAlign: "left",
                  color: "white",
                  marginLeft: "40px",
                  height: "100%",
                  borderLeft: "1px solid #eeeeee",
                  paddingLeft: "40px",
                }}
              >
                <Title
                  level={2}
                  style={{
                    color: "white",
                    marginBottom: "4px",
                    fontWeight: "bold",
                  }}
                >
                  스쿼트{" "}
                  <span style={{ fontSize: "18px", margin: "0 4px" }}>
                    | Squat
                  </span>
                </Title>
                <p style={{ margin: 0 }}>{currentDateString}</p>
                <p>
                  <span
                    style={{
                      fontSize: "40px",
                      marginRight: "6px",
                      fontWeight: "500",
                    }}
                  >
                    {count}
                  </span>
                  개
                  <span style={{ fontSize: "40px", margin: "0 10px" }}>/</span>
                  <span
                    style={{
                      fontSize: "40px",
                      marginRight: "6px",
                      fontWeight: "500",
                    }}
                  >
                    {set}
                  </span>
                  세트
                  <span
                    style={{
                      fontSize: "32px",
                      fontWeight: "250",
                      margin: "0 24px",
                    }}
                  >
                    {" "}
                    총 {count * set}개{" "}
                  </span>
                </p>
                {/* <p className="exercise-result-time">운동 시간 00 : 0 : 30</p> */}
                <p style={{ margin: "32px 0" }}>
                  <span style={{ fontSize: "16px", marginRight: "12px" }}>
                    소모 칼로리
                  </span>
                  <span
                    style={{
                      fontSize: "28px",
                      fontWeight: "550",
                      marginRight: "10px",
                    }}
                  >
                    {calorie}
                  </span>
                  <span style={{ fontSize: "16px" }}>kcal</span>
                </p>
                <p style={{ margin: "32px 0" }}>
                  <span style={{ fontSize: "16px", marginRight: "12px" }}>
                    중량
                  </span>
                  <span
                    style={{
                      fontSize: "28px",
                      fontWeight: "550",
                      marginRight: "10px",
                    }}
                  >
                    {weight}
                  </span>
                  <span style={{ fontSize: "16px" }}>kg</span>
                </p>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row justify="center">
        <Col>
          <div style={{ marginTop: "24px" }}>
            <Button
              type="primary"
              style={{
                marginRight: "12px",
                width: "150px",
                height: "48px",
                backgroundColor: "#212325",
                fontSize: "18px",
                fontWeight: "600",
                borderRadius: "16px",
              }}
              onClick={handleHome}
            >
              홈으로
            </Button>
            <Button
              type="primary"
              style={{
                marginRight: "12px",
                width: "150px",
                height: "48px",
                backgroundColor: "#c1eaca",
                color: "black",
                fontSize: "18px",
                fontWeight: "700",
                borderRadius: "16px",
              }}
              onClick={handleStats}
            >
              결과 자세히 보기
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SquatResult;
