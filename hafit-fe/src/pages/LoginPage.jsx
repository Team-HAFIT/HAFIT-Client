import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Row, Col } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
// import AxiosAPI from '../api/axios'

// import Header from "../components/Navbar";
import MyFooter from "../components/Footer";

import "../styles/pages/loginPage.css";

import kakao from "../assets/img/sns-icons/kakao-icon.png";
import google from "../assets/img/sns-icons/google-icon.png";
import naver from "../assets/img/sns-icons/naver-icon.png";

const LoginPage = () => {
  const [loading, setLoading] = useState(false); // 요청 중 여부 상태 저장용 state
  // const navigate = useNavigate(); // 페이지 이동을 위해 useNavigate hook 사용

  const onFinish = (values) => {
    setLoading(true); // 요청 시작 시 로딩 중 상태로 설정

    axios
      .post("http://172.26.21.193:8080/user/login", JSON.stringify(values), {
        headers: {
          "Content-Type": "application/json", // 요청 헤더에 Content-Type 설정
        },
        timeout: 1000, // 요청 제한 시간 설정
      })
      .then((response) => {
        console.log(response.data); // 응답 결과 출력

        const { userId } = response.data; // 엔드포인트의 return에서 userId 추출
        Cookies.set("userId", userId); // 쿠키에 userId 저장

        // navigate("/main"); // 로그인 성공 시 메인 페이지로 이동
        window.location.href = '/main';
      })
      .catch((error) => {
        console.error(error);
        if (error.response && error.response.status === 400) {
          alert("이메일 또는 비밀번호를 확인해주세요.");
        } else {
          alert("로그인 실패"); // 기타 에러 발생 시 에러 메시지 띄우기
        }
      })
      .finally(() => {
        setLoading(false); // 요청 종료 시 로딩 중 상태 해제
        const userId = Cookies.get("userId");
        console.log("쿠키: " + userId);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="top-container">
      {/* <Header /> */}
      <div className="body-wrapper">
        <div className="header-login">
          <h1>로그인</h1>
        </div>
        <div className="login-container">
          <Row justify="center" align="middle">
            <Col xs={24} sm={16} md={12} lg={8} align="middle">
              <Form
                className="login-form"
                name="basic"
                layout="vertical"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="on"
              >
                <Form.Item
                  label="이메일"
                  colon={false}
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "이메일을 입력해주세요!",
                    },
                  ]}
                >
                  <Input
                    placeholder="이메일 주소를 입력해주세요"
                    style={{ padding: "16px", fontSize: "16px" }}
                  />
                </Form.Item>
                <Form.Item
                  label="비밀번호"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "비밀번호를 입력해주세요!",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                    style={{ padding: "16px", fontSize: "16px" }}
                  />
                </Form.Item>

                <Form.Item>
                  <Row justify="space-between">
                    <Col>
                      <Form.Item
                        name="remember"
                        // valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>자동 로그인</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <a href="/forgot-password">비밀번호 찾기</a>
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item>
                  <Button
                    className="btn-submit"
                    style={{ color: "white" }}
                    htmlType="submit"
                    loading={loading}
                    block
                  >
                    로그인
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
        <div className="sns-login">
          {/* 카카오톡, 구글, 네이버 아이콘이 나란히 있는 SNS 간편 로그인 구현 */}
          <Link to="/" className="kakao-login">
            <img src={kakao} alt="카카오 로그인" style={{ width: "80%" }} />
          </Link>
          <Link to="/" className="google-login">
            <img src={google} alt="구글 로그인" style={{ width: "80%" }} />
          </Link>
          <Link to="/" className="naver-login">
            <img src={naver} alt="네이버 로그인" style={{ width: "80%" }} />
          </Link>
        </div>
        <div className="sign-up" style={{ textAlign: "center" }}>
          <span>아직 회원이 아니신가요?</span> <a href="/join">회원가입</a>
        </div>
      </div>
      <MyFooter />
    </div>
  );
};

export default LoginPage;
