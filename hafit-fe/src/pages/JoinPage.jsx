import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  // Select,
  Typography,
  Modal,
  Divider,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import PhoneNumberInput from "../components/inputs/PhoneNumberInput";
import MyFooter from "../components/Footer";

import "../styles/pages/joinPage.css";

// const { Option } = Select;
const { Title } = Typography;

const JoinPage = () => {
  const [loading, setLoading] = useState(false); // 요청 중 여부 상태 저장용 state
  const navigate = useNavigate(); // 페이지 이동을 위해 useNavigate hook 사용
  const [form] = Form.useForm();
  const [agreed, setAgreed] = useState(false);
  const [phone, setPhone] = useState(""); // 전화번호 입력값 상태 저장
  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 여부 상태값

  const handleAgreeChange = (e) => {
    setAgreed(e.target.checked);
  };

  const handlePhoneChange = (value) => {
    setPhone(value); // 전화번호 입력값 상태 업데이트
  };

  const handleOk = () => {
    setModalVisible(false);
    navigate("/intro"); // 로그인 성공 시 메인 페이지로 이동
  };

  // 이메일 중복체크
  const checkEmail = (email) => {
    return axios
      .get(`/api/auth/email/${email}`, {
        timeout: 5000,
      })
      .then((response) => {
        console.log(response.data);
        return response;
      })
      .catch(function (error) {
        if (error.response) {
          throw new Error(error.response.data);
        } else {
          throw new Error("서버와 연결이 끊겼습니다");
        }
      });
  };

  const onFinish = (values) => {
    setLoading(true); // 요청 시작 시 로딩 중 상태로 설정

    axios
      .post("/api/auth/signup", values, {
        headers: {
          "Content-Type": "application/json", // 요청 헤더에 Content-Type 설정
        },
        timeout: 5000, // 요청 제한 시간 설정
      })
      .then((response) => {
        console.log(response.data); // 응답 결과 출력
        setModalVisible(true);
      })
      .catch((error) => {
        console.error(error.response.data);
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
        <Row justify="center" align="middle" style={{ height: "100vh" }}>
          <Col span={12} align="middle">
            <Title level={3}>회원가입</Title>
            <Form
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
            >
              <Form.Item
                label="이메일"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "이메일을 입력해주세요",
                  },
                  // {
                  //   type: "email",
                  //   message: "유효한 이메일을 입력해주세요",
                  // },
                  {
                    // 이메일 정규식
                    pattern:
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "유효한 이메일을 입력해주세요",
                  },
                  {
                    // 실시간 이메일 중복검사
                    validator: async (_, email) => {
                      if (!email) {
                        return Promise.resolve();
                      }
                      try {
                        const response = await checkEmail(email);
                        if (response.data) {
                          return Promise.reject(
                            new Error("이미 사용중인 이메일입니다")
                          );
                        } else {
                          return Promise.resolve();
                        }
                      } catch (error) {
                        console.error(error);
                        return Promise.reject(
                          new Error("서버와 연결이 끊겼습니다")
                        );
                      }
                    },
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="example@gmail.com" maxLength={40} />
              </Form.Item>
              <Form.Item
                label="이름"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "이름을 입력해주세요",
                  },
                  {
                    min: 2,
                    message: "이름은 최소 2자리 이상이어야 합니다",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="홍길동" maxLength={24} />
              </Form.Item>
              <Form.Item
                label="비밀번호"
                name="password"
                rules={[
                  // {
                  //   required: true,
                  //   message: "비밀번호를 입력해주세요",
                  // },
                  // {
                  //   min: 8,
                  //   message: "비밀번호는 최소 8자리 이상이어야 합니다",
                  // },
                  // {
                  //   pattern: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/,
                  //   message: "영문, 숫자, 특수문자를 포함해야 합니다",
                  // },
                  {
                    validator: async (_, password) => {
                      if (!password) {
                        return Promise.reject(
                          new Error("비밀번호를 입력해주세요")
                        );
                      }
                      if (password.length < 8) {
                        return Promise.reject(
                          new Error("비밀번호는 최소 8자리 이상이어야 합니다")
                        );
                      }
                      // 비밀번호 정규식 : 영문, 숫자, 특수문자 포함
                      const pattern =
                        /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;

                      if (!pattern.test(password)) {
                        return Promise.reject(
                          new Error("영문, 숫자, 특수문자를 포함해야합니다")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  placeholder="영문, 숫자, 특수문자 포함 8자 ~ 20자"
                  maxLength={20}
                />
              </Form.Item>
              <Form.Item
                label="비밀번호 확인"
                name="passwordConfirm"
                rules={[
                  {
                    required: true,
                    message: "비밀번호를 한번 더 입력해주세요",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("비밀번호가 일치하지 않습니다")
                      );
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input.Password maxLength={20} />
              </Form.Item>
              <Divider plain>추가 정보</Divider>
              {/* 전화번호 인증 구현 전까지 'carrier' 주석 처리 */}
              {/* <Form.Item
                label="통신사 선택"
                name="carrier"
                rules={[
                  {
                    required: false,
                    message: "통신사를 선택해주세요",
                  },
                ]}
              >
                <Select placeholder="통신사 선택">
                  <Option value="SKT">SKT</Option>
                  <Option value="KT">KT</Option>
                  <Option value="LG">LG U+</Option>
                </Select>
              </Form.Item> */}
              <Form.Item
                label="전화번호"
                name="phone"
                rules={[
                  {
                    required: false,
                    message: "전화번호를 입력해주세요",
                  },
                ]}
                hasFeedback
              >
                <PhoneNumberInput onChange={handlePhoneChange} value={phone} />
              </Form.Item>

              <Form.Item>
                <Checkbox checked={agreed} onChange={handleAgreeChange}>
                  약관에 동의합니다
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Button
                  className="btn-submit-join"
                  type="primary"
                  htmlType="submit"
                  disabled={!agreed}
                  loading={loading}
                  block
                >
                  가입하기
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
      <MyFooter />
      <Modal // 모달 추가
        visible={modalVisible}
        title="환영합니다!"
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        centered
        closable={false}
      >
        회원 가입을 축하합니다!
        <br />
        로그인 후 이용해주세요 ˙ᵕ˙
      </Modal>
    </div>
  );
};
export default JoinPage;
