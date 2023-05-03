import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Row, Col } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // axios 모듈 import

import "../styles/loginPage.css";

import kakao from "../assets/img/sns-icons/kakao-icon.png";
import google from "../assets/img/sns-icons/google-icon.png";
import naver from "../assets/img/sns-icons/naver-icon.png";

const LoginPage = () => {
  const [loading, setLoading] = useState(false); // 요청 중 여부 상태 저장용 state
  const navigate = useNavigate(); // 프로그래밍적으로 페이지 이동을 위해 useNavigate hook 사용

  const onFinish = (values) => {
    setLoading(true); // 요청 시작 시 로딩 중 상태로 설정

    axios
      .post("http://172.26.8.73:8080/user/login", values, {
        headers: {
          "Content-Type": "application/json", // 요청 헤더에 Content-Type 설정
        },
      })
      .then((response) => {
        console.log(response.data); // 응답 결과 출력
        alert(response.data); // 응답 결과를 알림으로 띄우기

        navigate.push("/"); // 로그인 성공 시 메인 페이지로 이동
      })
      .catch((error) => {
        console.error(error);
        alert("로그인 실패"); // 에러 발생 시 에러 메시지 띄우기
      })
      .finally(() => {
        setLoading(false); // 요청 종료 시 로딩 중 상태 해제
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="top-container">
      <div className="body-wrapper">
        <div className="header-login">
          <h1>로그인</h1>
        </div>
        <center>
          <div className="login-container">
            <Form
              className="login-form"
              name="basic"
              labelCol={{
                span: 0,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="on"
            >
              <Form.Item
                name="loginId" // email 대신 loginId로 수정
                rules={[
                  {
                    required: true,
                    message: "이메일을 입력해주세요!",
                  },
                ]}
              >
                <Input
                  placeholder="이메일 입력"
                  style={{ height: "4rem", fontSize: "1rem" }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "비밀번호를 입력해주세요!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="비밀번호 입력"
                  style={{ height: "4rem", fontSize: "1rem" }}
                />
              </Form.Item>
              <Row
                gutter={[16, 0]}
                justify={"space-between"}
                style={{ maxWidth: 600, width: "100%" }}
              >
                <Col flew="1">
                  <Form.Item name="remember" valuePropName="checked">
                    <Checkbox style={{ width: "120px" }}>자동 로그인</Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <a href="/forgot-password">비밀번호 찾기</a>
                </Col>
              </Row>

              <Form.Item
                wrapperCol={{
                  offset: 6,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit" loading={loading}>
                  로그인
                </Button>
              </Form.Item>
            </Form>
          </div>
        </center>
        <div className="sns-login">
          {/* 카카오톡, 구글, 네이버 아이콘이 나란히 있는 SNS 간편 로그인 구현 */}
          <Link to="/" className="kakao-login">
            <img src={kakao} alt="카카오 로그인" style={{ width: "90%" }} />
          </Link>
          <Link to="/" className="google-login">
            <img src={google} alt="구글 로그인" style={{ width: "90%" }} />
          </Link>
          <Link to="/" className="naver-login">
            <img src={naver} alt="네이버 로그인" style={{ width: "90%" }} />
          </Link>
        </div>
        <div className="sign-up" style={{ textAlign: "center" }}>
          <span>아직 회원이 아니신가요?</span> <a href="/join">회원가입</a>
        </div>

        {/* Footer */}
        <div className="footer">
          {" "}
          <hr style={{ background: "#dbdbdb", height: "1px", border: "0" }} />
          <p style={{ color: "#999999" }}>© 2023 HAFIT. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
