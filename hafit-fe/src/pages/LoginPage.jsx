import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Row, Col } from "antd";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { loginUser } from "../api/Users";
import { SET_TOKEN } from "../store/Auth";

import MyFooter from "../components/Footer";

import "../styles/pages/loginPage.css";

import { KAKAO_AUTH_URL } from "../components/oauth/kakao/OAuthKakao";

import kakao from "../assets/img/sns-icons/kakao-icon.png";
import google from "../assets/img/sns-icons/google-icon.png";
import naver from "../assets/img/sns-icons/naver-icon.png";

const LoginPage = () => {
  const [loading, setLoading] = useState(false); // 요청 중 여부 상태 저장용 state
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async ({ email, password }) => {
    setLoading(true); // 요청 시작 시 로딩 중 상태로 설정

    const res = await loginUser({ email, password });

    if (res.status) {
      // 2023. 06. 11 - 백엔드에서 토큰 발급 시 쿠키에 저장하여 발급하도록 변경
      // const refreshToken = res.refreshToken; 
      // setRefreshToken(refreshToken);

      const accessToken = res.accessToken;
      // store에 Access Token 저장
      dispatch(SET_TOKEN(accessToken));

      setLoading(false);
      return navigate("/main");
    } else {
      form.setFields([
        {
          name: "password",
          errors: ["이메일 또는 비밀번호를 확인해주세요"],
        },
      ]);
      console.log(res.json);
      setLoading(false);
    }
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
        <div className="login-container">
          <Row justify="center" align="middle">
            <Col xs={24} sm={16} md={12} lg={8} align="middle">
              <Form
                form={form}
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
          <Link to={KAKAO_AUTH_URL} className="kakao-login">
            <img src={kakao} alt="카카오 로그인" style={{ width: "80%" }} />
          </Link>
          <Link
            to="http://172.26.21.193:8080/oauth2/authorization/google"
            className="google-login"
          >
            <img src={google} alt="구글 로그인" style={{ width: "80%" }} />
          </Link>
          <Link
            to="http://172.26.21.193:8080/oauth2/authorization/google"
            className="naver-login"
          >
            <img src={naver} alt="네이버 로그인" style={{ width: "80%" }} />
          </Link>
        </div>
        <div className="sign-up" style={{ textAlign: "center", marginBottom: "24px" }}>
          <span>아직 회원이 아니신가요?</span> <a href="/join">회원가입</a>
        </div>
      </div>
      <MyFooter />
    </div>
  );
};

export default LoginPage;
