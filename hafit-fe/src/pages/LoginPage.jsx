import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { Link } from "react-router-dom";

import "../styles/loginPage.css";

import kakao from "../assets/img/sns-icons/kakao-icon.png";
import google from "../assets/img/sns-icons/google-icon.png";
import naver from "../assets/img/sns-icons/naver-icon.png";

const onFinish = (values) => {
  console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function LoginPage() {
  return (
    <div className="top-container">
      <div className="body-wrapper">
        <div className="header-login">
          <h1>로그인</h1>
        </div>
        <div className="login-container">
          <Form
            name="basic"
            labelCol={{
              span: 0,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
              width: '100%',
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="on"
          >
            <Form.Item
              name="username"
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
            <Form.Item
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100px"
              }}
            >
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>자동 로그인</Checkbox>
              </Form.Item>
                <a href="/forgot-password" style={{ marginLeft: "auto" }}>비밀번호 찾기</a>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 6,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                로그인
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="sns-login">
          {/* 카카오톡, 구글, 네이버 아이콘이 나란히 있는 SNS 간편 로그인 구현 */}
          <Link to="/" className="kakao-login">
            <img src={kakao} alt="카카오 로그인" style={{width: '90%'}} />
          </Link>
          <Link to="/" className="google-login">
            <img src={google} alt="구글 로그인" style={{width: '90%'}} />
          </Link>
          <Link to="/" className="naver-login">
            <img src={naver} alt="네이버 로그인" style={{width: '90%'}} />
          </Link>
        </div>
        <div className="sign-up" style={{textAlign: "center"}}>
          <span>아직 회원이 아니신가요?</span> <a href="/join">회원가입</a>
        </div>

        {/* Footer */}
        <div className="footer">
          {" "}
          <hr style={{background: "#dbdbdb", height: "1px", border: "0"}} />
          <p style={{color:"#999999"}}>© 2023 HAFIT. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
