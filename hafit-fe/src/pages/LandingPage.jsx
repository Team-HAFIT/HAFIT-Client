import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

// import Header from "../components/Navbar";
import MyFooter from "../components/Footer";

import "../styles/pages/landingPage.css";

// import Feature1 from "../assets/img/poseEstimation.png";

function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="top-container">
      {/* <Header /> */}
      <div className="body-wrapper" style={{ margin: 0 }}>
        <div className="header">
          {" "}
          {/* 
            - # 2023. 5. 2. 화요일
            - 임시 문구이며 추후 수정 필요
            - 폰트, 색상, 사이즈 수정 필요
            - 버튼은 추후 디자인 수정 예정, component로 분리하여 사용할 예정
            - 정렬, 마진 등은 추후 수정 예정
          */}
          <h3>AI 헬스 메이트, 해핏 ˙ᵕ˙</h3>
          <div>
            <h1>Hafit</h1>
          </div>
          <p>
            AI 분석을 통해 운동 자세 교정을 돕고, 개수와 세트수를 대신
            세어드릴게요!
          </p>
          <Button
            className="btn-start"
            style={{ color: "white" }}
            onClick={handleLogin}
          >
            해핏 시작하기
          </Button>
        </div>

        {/* Feature */}
        {/* <div className="container">
          {" "}
          <h2>Feature</h2>
          <Row gutter={32}>
            <Col span={8} className="feature">
              {" "}
              <img src={Feature1} alt="기능 1" />
              <h3>Feature 1</h3>
              <p>올바른 자세를</p>
            </Col>
            <Col span={8} className="feature">
              {" "}
              <img src="feature-icon-2.svg" alt="기능 2" />
              <h3>Feature 2</h3>
              <p>
                Ut ac facilisis ante, in pellentesque felis. Integer arcu nisl,
                eleifend at pretium id, pulvinar nec sapien.
              </p>
            </Col>
            <Col span={8} className="feature">
              {" "}
              <img src="feature-icon-3.svg" alt="기능 3" />
              <h3>Feature 3</h3>
              <p>
                Aliquam erat volutpat. Mauris fermentum tincidunt lacus, sed
                fermentum enim vehicula ac.
              </p>
            </Col>
          </Row>
        </div> */}
      </div>

      <MyFooter />
    </div>
  );
}

export default LandingPage;
