// 성별 전달 안됨
// 생년월일 수정 불가능
// 고치기

import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Radio,
  Typography,
  Modal,
  Spin,
  Divider,
} from "antd";
import DatePicker from "react-datepicker";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import PhoneNumberInput from "../../components/inputs/PhoneNumberInput";
// import Header from "../../components/Navbar";

import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";

import "../../styles/pages/joinPage.css";

const { Option } = Select;
const { Title } = Typography;

const EditMyInfo = (userId) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    gender: "",
    height: "",
    weight: "",
  });

  const [loading, setLoading] = useState(false); // 요청 중 여부 상태 저장용 state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");

    if (userId) {
      axios
        .get("/user/info", {
          params: {
            userId: userId,
          },
          timeout: 5000, // 요청 제한 시간 설정
        })
        .then((response) => {
          
          const birthday = new Date(response.data.birthday);
          setUserInfo(response.data);
          setUserInfo({
            ...response.data,
            birthday,
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
  }, [userId]);

  const navigate = useNavigate(); // 페이지 이동을 위해 useNavigate hook 사용
  const [form] = Form.useForm();
  const [phone, setPhone] = useState(""); // 전화번호 입력값 상태 저장
  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 여부 상태값

  const [birth, setBirth] = useState(new Date());

  const handlePhoneChange = (value) => {
    setPhone(value); // 전화번호 입력값 상태 업데이트
  };

  const handleOk = () => {
    setModalVisible(false);
    navigate("/intro"); // 수정 성공 시 메인 페이지로 이동
  };

  const handleChangePassword = () => {
    const userId = Cookies.get("userId");
    if(userId) {;
      navigate(`/user/editPwd?userId=${userId}`);
    }
  };

  const onFinish = (values) => {
    setLoading(true); // 요청 시작 시 로딩 중 상태로 설정

    // 기존 userInfo 상태값을 복사한 후 수정된 값만 업데이트합니다.
    const updatedUserInfo = { ...userInfo, ...values };

    axios
      .post("/user/update", updatedUserInfo, {
        headers: {
          "Content-Type": "application/json", // 요청 헤더에 Content-Type 설정
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
    const userId = Cookies.get("userId");

    Modal.confirm({
      title: "정말 탈퇴하시겠어요?",
      onOk: () => {
        axios
          .post(`/user/delete?userId=${userId}`, { userId }, {
            headers: {
              "Content-Type": "application/json", // 요청 헤더에 Content-Type 설정
            },
            timeout: 5000, // 요청 제한 시간 설정
          })
          .then(() => {
            navigate("/"); // 요청이 성공하면 '/' 랜딩 페이지로 이동
          })
          .catch((error) => {
            console.error(error);
            // console.log(userId);
            // console.log(typeof(userId));
          });
      },
      onCancel: () => {
        console.log("탈퇴를 취소하셨습니다! ˙ᵕ˙");
      },
    });
  };

  return (
    <div className="top-container">
      {/* <Header /> */}
      {isLoading ? (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          background: "rgba(0, 0, 0, 0.05)",
          height: "calc(100vh - 50px)",
        }}>
          <Spin style={{paddingBottom: "96px",}}/>
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
                  label="이름"
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
                    placeholder={userInfo.name}
                    defaultValue={userInfo.name}
                    readOnly={false}
                  />
                </Form.Item>
                <Form.Item
                  label="이메일"
                  name="email"
                  initialValue={userInfo.email}
                >
                  <Input
                    placeholder={userInfo.email}
                    defaultValue={userInfo.email}
                    readOnly={false}
                  />
                </Form.Item>
                <Form.Item label="비밀번호">
                  <Button onClick={handleChangePassword}>비밀번호 변경</Button>
                </Form.Item>
                <Form.Item
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
                </Form.Item>
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
                <Divider plain>추가 정보</Divider>
                <Form.Item
                  label="생년월일"
                  name="birthday"
                  rules={[
                    {
                      required: false,
                      message: "생년월일을 입력해주세요",
                    },
                  ]}
                >
                  <DatePicker
                    locale={ko}
                    selected={userInfo.birthday || birth}
                    onChange={(date) => setBirth(date)}
                    dateFormat="yyyy년 MM월 dd일"
                    minDate={new Date("1900-01-01")}
                    maxDate={new Date()}
                  />
                </Form.Item>
                <Form.Item
                  label="성별"
                  name="gender"
                  initialValue={userInfo.gender}
                  rules={[
                    {
                      required: false,
                      message: "성별을 선택해주세요",
                    },
                  ]}
                >
                  <Radio.Group defaultValue={userInfo.gender}>
                    <Radio value="m">남자</Radio>
                    <Radio value="f">여자</Radio>
                    <Radio value="null">선택안함</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="키(cm)"
                  name="height"
                  rules={[
                    {
                      required: false,
                      message: "키를 입력해주세요",
                    },
                  ]}
                >
                  <Input
                    placeholder="160"
                    suffix="cm"
                    value={userInfo.height}
                  />
                </Form.Item>
                <Form.Item
                  label="몸무게(kg)"
                  name="weight"
                  rules={[
                    {
                      required: false,
                      message: "몸무게를 입력해주세요",
                    },
                  ]}
                >
                  <Input placeholder="60" suffix="kg" value={userInfo.weight} />
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
