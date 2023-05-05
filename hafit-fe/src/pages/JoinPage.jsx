import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import { useState } from "react";

import PhoneNumberInput from "../components/inputs/phoneNumberInput";

import "../styles/joinPage.css";

const { Option } = Select;
const { Title } = Typography;

const JoinPage = () => {
  const [form] = Form.useForm();
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (values) => {
    console.log("수신된 양식 값: ", values);
  };

  const handleAgreeChange = (e) => {
    setAgreed(e.target.checked);
  };

  return (
    <div>
      <Row justify="center" align="middle" style={{ height: "100vh" }} >
        <Col span={12} align="middle">
          <Title level={3}>회원가입</Title>
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              label="이메일"
              name="email"
              rules={[
                {
                  required: true,
                  message: "이메일을 입력해주세요",
                },
                {
                  type: "email",
                  message: "유효한 이메일을 입력해주세요",
                },
              ]}
            >
              <Input placeholder="example@gmail.com" />
            </Form.Item>
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
              <Input placeholder="홍길동" />
            </Form.Item>
            <Form.Item
              label="비밀번호"
              name="password"
              rules={[
                {
                  required: true,
                  message: "비밀번호를 입력해주세요",
                },
                {
                  min: 6,
                  message: "비밀번호는 최소 6자리 이상이어야 합니다",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="비밀번호 확인"
              name="passwordConfirm"
              rules={[
                {
                  required: true,
                  message: "비밀번호 확인을 입력해주세요",
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
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="통신사 선택"
              name="carrier"
              rules={[
                {
                  required: true,
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
            {/* <Form.Item
              label="전화번호"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "전화번호를 입력해주세요",
                },
              ]}
            >
              <Input placeholder="010-1234-5678" />
            </Form.Item> */}
            <PhoneNumberInput />
            <Form.Item>
              <Checkbox checked={agreed} onChange={handleAgreeChange}>
                약관에 동의합니다
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={!agreed}>
                가입하기
              </Button>
            </Form.Item>
          </Form>
        </Col>  
      </Row>
    </div>
  );
};
export default JoinPage;
