/* 2023/06/12
 * carrier 값이 변경되지 않는 문제 발생, 원인 파악 필요
 * 휴대폰 인증 구현 전까지 'carrier' 주석 처리
 * */

import {
  Button,
  Col,
  Form,
  Input,
  Row,
  // Select,
  Radio,
  Typography,
  Modal,
  Spin,
  Divider,
  DatePicker,
  ConfigProvider,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import locale from "antd/locale/ko_KR";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";

import { removeCookieToken } from "../../storage/Cookie";
import { DELETE_TOKEN } from "../../store/Auth";

import PhoneNumberInput from "../../components/inputs/PhoneNumberInput";

import "../../styles/pages/joinPage.css";

// const { Option } = Select;
const { Title } = Typography;

const EditMyInfo = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    // carrier: "",
    phone: "",
    birthday: "",
    sex: "",
    height: "",
    weight: "",
  });

  const accessToken = useSelector((state) => state.authToken.accessToken);
  let decodedToken = null; // 토큰 값이 없을 경우 에러 방지용
  if (accessToken) {
    decodedToken = jwt_decode(accessToken);
  }
  const userEmail = decodedToken.email;

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false); // 요청 중 여부 상태 저장용 state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userEmail) {
      axios
        .get(`/api/my`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          timeout: 5000, // 요청 제한 시간 설정
        })
        .then((response) => {
          setUserInfo(response.data);
          setUserInfo({
            ...response.data,
          });
          console.log(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [accessToken, userEmail]);

  const navigate = useNavigate(); // 페이지 이동을 위해 useNavigate hook 사용
  const [form] = Form.useForm();
  const [phone, setPhone] = useState(""); // 전화번호 입력값 상태 저장
  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 여부 상태값

  const handlePhoneChange = (value) => {
    setPhone(value); // 전화번호 입력값 상태 업데이트
  };

  const handleOk = () => {
    setModalVisible(false);
    window.location.href = `/user/info`;
  };

  const handleChangePassword = () => {
    navigate(`/user/editPwd`);
  };

  const onFinish = (values) => {
    setLoading(true); // 요청 시작 시 로딩 중 상태로 설정

    // 기존 userInfo 상태값을 복사한 후 수정된 값만 업데이트합니다.
    const updatedUserInfo = { ...userInfo, ...values };

    // 'birthday' 값을 'YYYY-MM-DD' 형식으로 변경
    if (values.birthday && typeof values.birthday.format === "function") {
      updatedUserInfo.birthday = values.birthday.format("YYYY-MM-DD");
    }

    console.log(updatedUserInfo);
    console.log("생년월일: " + updatedUserInfo.birthday);
    console.log("이름: " + updatedUserInfo.name);
    console.log("통신사: " + updatedUserInfo.carrier);
    console.log("통신사: " + typeof updatedUserInfo.carrier);

    axios
      .put(`/api/my/${userEmail}`, updatedUserInfo, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        timeout: 5000, // 요청 제한 시간 설정
      })
      .then((response) => {
        console.log(response.data); // 응답 결과 출력
        setModalVisible(true);
        setUserInfo(updatedUserInfo); // 수정된 내용으로 state 업데이트
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

  const handleDelete = () => {
    Modal.confirm({
      title: "정말 탈퇴하시겠어요?",
      onOk: () => {
        axios
          .delete(`/api/my/${userEmail}`, {
            headers: {
              "Content-Type": "application/json", // 요청 헤더에 Content-Type 설정
              authorization: `Bearer ${accessToken}`,
            },
            timeout: 5000, // 요청 제한 시간 설정
          })
          .then(() => {
            dispatch(DELETE_TOKEN());
            removeCookieToken();
            window.location.href = "/"; // 요청이 성공하면 '/' 랜딩 페이지로 이동
          })
          .catch((error) => {
            console.error(error);
          });
      },
      onCancel: () => {
        console.log("탈퇴를 취소하셨습니다! ˙ᵕ˙");
      },
    });
  };

  return (
    <div className="top-container">
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            background: "rgba(0, 0, 0, 0.05)",
            height: "calc(100vh - 50px)",
          }}
        >
          <Spin style={{ paddingBottom: "96px" }} />
        </div>
      ) : (
        /* 로딩이 완료되면 아래의 내용을 랜더링 */
        <div className="body-wrapper">
          <Row justify="center" align="middle" style={{ height: "100vh" }}>
            <Col span={12} align="middle">
              <Title level={3}>내 정보 수정</Title>
              <Form
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
              >
                <Form.Item
                  label="닉네임"
                  name="name"
                  initialValue={userInfo.name}
                  rules={[
                    {
                      required: true,
                      message: "이름을 입력해주세요",
                    },
                  ]}
                >
                  <Input
                    placeholder="김해핏"
                    value={userInfo.name}
                    readOnly={false}
                  />
                </Form.Item>
                <Form.Item
                  label="이메일"
                  name="email"
                  initialValue={userInfo.email}
                >
                  <Input
                    placeholder="example@hafit.net"
                    readOnly={true}
                    style={{
                      border: "none",
                      fontSize: "16px",
                      textAlign: "center",
                      fontWeight: "500",
                    }}
                  />
                </Form.Item>
                <Form.Item label="비밀번호">
                  <Button
                    onClick={handleChangePassword}
                    style={{
                      width: "50%",
                      height: "40px",
                      backgroundColor: "#111111",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "1rem",
                      fontWeight: "550",
                    }}
                  >
                    비밀번호 변경
                  </Button>
                </Form.Item>
                <Divider plain>추가 정보</Divider>
                {/* <Form.Item
                  label="통신사 선택"
                  name="carrier"
                  initialValue={userInfo.carrier}
                  rules={[
                    {
                      required: false,
                      message: "통신사를 선택해주세요",
                    },
                  ]}
                >
                  <Select
                    placeholder="통신사 선택"
                    name="carrier"
                    defaultValue={userInfo.carrier}
                  >
                    <Option value="SKT">SKT</Option>
                    <Option value="KT">KT</Option>
                    <Option value="LG">LG U+</Option>
                  </Select>
                </Form.Item> */}
                <Form.Item
                  label="전화번호"
                  name="phone"
                  initialValue={userInfo.phone}
                  rules={[
                    {
                      required: false,
                      message: "전화번호를 입력해주세요",
                    },
                  ]}
                >
                  <PhoneNumberInput
                    onChange={handlePhoneChange}
                    value={phone}
                    defaultValue={userInfo.phone}
                  />
                </Form.Item>
                <Form.Item
                  label="생년월일"
                  name="birthday"
                  initialValue={userInfo.birthday}
                  rules={[
                    {
                      required: false,
                      message: "생년월일을 입력해주세요",
                    },
                  ]}
                >
                  <ConfigProvider locale={locale}>
                    <DatePicker
                      onChange={(date) =>
                        form.setFieldsValue({ birthday: date })
                      }
                      format="YYYY년 M월 D일"
                      defaultValue={
                        userInfo.birthday !== null
                          ? dayjs(userInfo.birthday, "YYYY-MM-DD")
                          : null
                      }
                      disabledDate={(current) => {
                        return (
                          // 현재 날짜 이후를 제한합니다.
                          (current && current > dayjs().endOf("day")) ||
                          // 1900년 1월 1일 이전을 비활성화합니다.
                          (current &&
                            current < dayjs("1900-01-01").startOf("day"))
                        );
                      }}
                      style={{ width: "100%" }}
                    />
                  </ConfigProvider>
                </Form.Item>
                <Form.Item
                  label="성별"
                  name="sex"
                  initialValue={userInfo.sex}
                  rules={[
                    {
                      required: false,
                      message: "성별을 선택해주세요",
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value="m">남자</Radio>
                    <Radio value="f">여자</Radio>
                    <Radio value="null">선택안함</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="키(cm)"
                  name="height"
                  initialValue={userInfo.height}
                  rules={[
                    {
                      required: false,
                      message: "키를 입력해주세요",
                    },
                  ]}
                >
                  <Input suffix="cm" value={userInfo.height} />
                </Form.Item>
                <Form.Item
                  label="몸무게(kg)"
                  name="weight"
                  initialValue={userInfo.weight}
                  rules={[
                    {
                      required: false,
                      message: "몸무게를 입력해주세요",
                    },
                  ]}
                >
                  <Input suffix="kg" value={userInfo.weight} />
                </Form.Item>
                <Divider />
                <Form.Item>
                  <Button
                    className="btn-submit-join"
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                  >
                    변경 내용 저장
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button onClick={handleDelete} danger block>
                    회원 탈퇴
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      )}
      <Modal // 모달 추가
        visible={modalVisible}
        title="내 정보 수정 완료!"
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        centered
        closable={false}
      >
        수정된 내용을 저장하였습니다 ˙ᵕ˙
      </Modal>
    </div>
  );
};
export default EditMyInfo;
