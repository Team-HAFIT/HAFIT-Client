import { Button, Col, Form, Input, Row, Typography, Modal, message } from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import MyFooter from "../../components/Footer";

import "../../styles/pages/joinPage.css";

const { Title } = Typography;

const EditPwd = () => {
  const [loading, setLoading] = useState(false); // 요청 중 여부 상태 저장용 state
  // const navigate = useNavigate(); // 페이지 이동을 위해 useNavigate hook 사용
  const [form] = Form.useForm();

  // 수정 시작 ~

  const { userId } = useParams(); // URL 파라미터에서 userId 가져오기

  // useEffect(() => {
  //   if (userId) {
  //     axios
  //       .get("/user/info", {
  //         params: {
  //           userId: userId,
  //         },
  //         timeout: 5000, // 요청 제한 시간 설정
  //       })
  //       .then((response) => {
  //         setUserInfo(response.data);
  //         setUserInfo({
  //           ...response.data,
  //         });
  //         console.log(response.data);
  //         setLoading(false); // 요청 종료 시 로딩 중 상태 해제
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //         setLoading(false); // 요청 종료 시 로딩 중 상태 해제
  //       });
  //   } else {
  //     console.log("userId 값이 없습니다.");
  //   }
  // }, [userId]);

  const onFinish = (values) => {
    setLoading(true); // 요청 시작 시 로딩 중 상태로 설정
    // const userId = Cookies.get("userId");

    Modal.confirm({
      title: "비밀번호를 변경하시겠어요?",
      // content: "비밀번호 변경 후 로그인을 다시 해주세요",
      okText: "변경하기",
      cancelText: "취소",

      onOk: () => {
        axios
          .post(`/user/changePassword?userId=${userId}`, values, {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 5000,
          })
          .then((response) => {
            console.log("비밀번호 변경 요청");
            console.log(response.data); // 응답 결과 출력
            if(response.data === true) {
              message.success("비밀번호가 변경되었습니다. 다시 로그인해주세요", 2, () => {
                Cookies.remove("userId");
                window.location.href = "/login";
                // navigate("/user/info"); // 성공 시 회원 정보 페이지로 이동
              });   
            } else {
              form.setFields([{
                name: "oldPassword",
                errors: ["현재 사용 중인 비밀번호와 일치하지 않습니다"],
              }]);
            }
          })
          .catch((error) => {
            console.error(error.response.data);
          })
          .finally(() => {
            setLoading(false);
          })
      },
      onCancel: () => {
        setLoading(false);
      },
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
            <Title level={3}>비밀번호 변경</Title>
            <Form
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
            >
              <Form.Item
                label="현재 비밀번호"
                name="oldPassword"
                rules={[
                  {
                    required: true,
                    message: "현재 비밀번호를 입력해주세요",
                  },
                  // {
                  //   validator: async (_, password) => {
                  //     if (password && userInfo.password !== password) {
                  //       return Promise.reject(
                  //         new Error("사용중인 비밀번호와 일치하지 않습니다.")
                  //       );
                  //     }
                  //     return Promise.resolve();
                  //   },
                  // },
                ]}
              >
                <Input.Password maxLength={20} />
              </Form.Item>
              <Form.Item
                label="새 비밀번호"
                name="newPassword"
                rules={[
                  {
                    validator: async (_, password) => {
                      if (!password) {
                        return Promise.reject(
                          new Error("새 비밀번호를 입력해주세요")
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
                    message: "새 비밀번호를 한번 더 입력해주세요",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
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
              <Form.Item>
                <Button
                  className="btn-submit-join"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  변경하기
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
      <MyFooter />
    </div>
  );
};
export default EditPwd;
