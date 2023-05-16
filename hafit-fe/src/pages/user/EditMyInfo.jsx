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
} from "antd";
import DatePicker from "react-datepicker";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import PhoneNumberInput from "../../components/inputs/PhoneNumberInput";
import Header from "../../components/Navbar";

import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";

import "../../styles/pages/joinPage.css";

const { Option } = Select;
const { Title } = Typography;

const EditMyInfo = () => {
  const [loading, setLoading] = useState(false); // 요청 중 여부 상태 저장용 state
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
    navigate("/change-password");
  };

  const onFinish = (values) => {
    setLoading(true); // 요청 시작 시 로딩 중 상태로 설정

    axios
      .post("/user/info/edit", values, {
        headers: {
          "Content-Type": "application/json", // 요청 헤더에 Content-Type 설정
        },
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

  const handleDelete = () => {
    Modal.confirm({
      title: "정말 탈퇴하시겠어요?",
      onOk: () => {
        axios
          .delete("/user/delete")
          .then(() => {
            navigate("/"); // 요청이 성공하면 '/' 랜딩 페이지로 이동
          })
          .catch((error) => {
            console.error(error);
          });
      },
      onCancel: () => {
        console.log("탈퇴를 취소하셨습니다!");
      },
    });
  };

  return (
    <div className="top-container">
      <Header />
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
                rules={[
                  {
                    required: true,
                    message: "이름을 입력해주세요",
                  },
                ]}
              >
                <Input value="김해핏" placeholder="홍길동" />
              </Form.Item>
              <Form.Item label="이메일" name="email">
                <Input value="example@hafit.com" readOnly />
                <Input type="hidden" value="example@hafit.com" />
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
                rules={[
                  {
                    required: false,
                    message: "전화번호를 입력해주세요",
                  },
                ]}
              >
                <PhoneNumberInput onChange={handlePhoneChange} value={phone} />
              </Form.Item>
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
                  selected={birth}
                  onChange={(date) => setBirth(date)}
                  dateFormat="yyyy년 MM월 dd일"
                  minDate={new Date("1900-01-01")}
                  maxDate={new Date()}
                />
              </Form.Item>
              <Form.Item
                label="성별"
                name="gender"
                rules={[
                  {
                    required: false,
                    message: "성별을 선택해주세요",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value="male">남자</Radio>
                  <Radio value="female">여자</Radio>
                  <Radio value="unchecked">선택안함</Radio>
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
                <Input placeholder="160" suffix="cm" />
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
                <Input placeholder="60" suffix="kg" />
              </Form.Item>
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
