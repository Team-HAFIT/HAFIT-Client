import React from "react";
import { Button, Row, Col } from "antd";
// import { Link } from "react-router-dom";

import "../styles/landingPage.css";

import Feature1 from "../assets/img/poseEstimation.png";

function LandingPage() {
  return (
    <div>
      {/* Header */}
      <div className="header">
        {" "}
        {/* 
          - # 2023. 5. 2. 화요일
          - 임시 문구이며 추후 수정 필요
          - 폰트, 색상, 사이즈 수정 필요
          - 버튼은 추후 디자인 수정 예정, component로 분리하여 사용할 예정
          - 정렬, 마진 등은 추후 수정 예정
        */}
        <h3 style={{marginTop: "56px", marginBottom: "0", marginRight:"152px", fontWeight: "400"}}>AI 헬스 메이트, 해핏 ˙ᵕ˙</h3>
        <div style={{backgroundColor: "rgb(108, 0, 240)", marginTop: "8px", padding: "10px"}}>
          <h1 style={{fontSize: "120px", fontWeight: "800", color: "white", textShadow: "4px 4px 64px #fff"}}>HAFIT</h1>
        </div>
        <p style={{ fontSize: "18px"}}>AI 분석을 통해 자세를 교정해주고, 개수와 세트수를 대신 세어드릴게요!</p>
        <Button type="primary" size="large" style={{marginTop: "156px", marginBottom:"16px", fontSize: "16px", fontWeight: "500", padding: "24px", display:"flex", alignItems: "center", backgroundColor: "rgb(108, 0, 240)"}}>
          해핏 시작하기
        </Button>
      </div>

      {/* Feature */}
      <div className="container" style={{marginLeft:"5rem", marginRight:"5rem"}}>
        {" "}
        <h2>Feature</h2>
        <Row gutter={32}>
          <Col span={8} className="feature">
            {" "}
            <img src={Feature1} alt="기능 1" />
            <h3>Feature 1</h3>
            <p>
              올바른 자세를 
            </p>
          </Col>
          <Col span={8} className="feature">
            {" "}
            {/* 클래스 이름으로 스타일 적용 */}
            <img src="feature-icon-2.svg" alt="기능 2" />
            <h3>Feature 2</h3>
            <p>
              Ut ac facilisis ante, in pellentesque felis. Integer arcu nisl,
              eleifend at pretium id, pulvinar nec sapien.
            </p>
          </Col>
          <Col span={8} className="feature">
            {" "}
            {/* 클래스 이름으로 스타일 적용 */}
            <img src="feature-icon-3.svg" alt="기능e 3" />
            <h3>Feature 3</h3>
            <p>
              Aliquam erat volutpat. Mauris fermentum tincidunt lacus, sed
              fermentum enim vehicula ac.
            </p>
          </Col>
        </Row>
      </div>

      {/* Footer */}
      <div className="footer">
        {" "}
        {/* 클래스 이름으로 스타일 적용 */}
        <p>© 2022 Your Awesome App Name. All rights reserved.</p>
      </div>
    </div>
  );
}

export default LandingPage;
