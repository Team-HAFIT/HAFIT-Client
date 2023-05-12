import React, { useState } from "react";
import { Form, InputNumber, Button, Card, Row, Col, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import Header from "../../../components/MainNavbar";

const { Title } = Typography;

const SqautSetting = () => {
    const [loading, setLoading] = useState(false); // 요청 중 여부 상태 저장용 state
    const navigate = useNavigate(); // 페이지 이동을 위해 useNavigate hook 사용
    
    const onFinish = (values) => {
        setLoading(true); // 요청 시작 시 로딩 중 상태로 설정
    
        axios
          .post("http://172.20.3.123:8080/setexec", JSON.stringify(values), {
            headers: {
              "Content-Type": "application/json", // 요청 헤더에 Content-Type 설정
            },
          })
          .then((response) => {
            console.log(response.data); // 응답 결과 출력
            
            navigate("/intro"); // 로그인 성공 시 메인 페이지로 이동
          })
          .catch((error) => {
            console.error(error);
            if (error.response && error.response.status === 400) {
              alert("값을 확인해주세요.");
            } else {
              alert("에러 발생"); // 기타 에러 발생 시 에러 메시지 띄우기
            }
          })
          .finally(() => {
            setLoading(false); // 요청 종료 시 로딩 중 상태 해제
          });
      };

      const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
      };

  return (
    <div>
      <Header />
      <Row justify="center" style={{ height: "100vh", marginTop: "4rem" }}>
        <Col span={12} align="middle">
          <Title level={2} align="middle">스쿼트 테스트</Title>

          <Card>
            <Form
              name="exercise"
              layout="vertical"
              autoComplete="off"
              style={{ marginTop: "20px" }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="목표 개수"
                name="repsPerSet"
                rules={[
                  {
                    required: true,
                    message: "목표 개수를 입력해주세요!",
                  },
                ]}
              >
                {/* min과 max는 입력 가능한 범위를 설정하는 부분입니다. */}
                <InputNumber min={1} max={100} step={5} />
              </Form.Item>

              <Form.Item
                label="세트 수"
                name="totalSets"
                rules={[
                  {
                    required: true,
                    message: "세트 수를 입력해주세요!",
                  },
                ]}
              >
                <InputNumber min={1} max={10} />
              </Form.Item>

              <Form.Item
                label="중량"
                name="weight"
                rules={[
                  {
                    required: true,
                    message: "중량을 입력해주세요!",
                  },
                ]}
              >
                {/* step은 숫자의 증감 단위를 설정하는데, 이 경우 5씩 증감합니다.*/}
                <InputNumber min={1} max={100} step={5} />
              </Form.Item>

              <Form.Item
                label="휴식 시간"
                name="restTime"
                rules={[
                  {
                    required: true,
                    message: "휴식 시간을 입력해주세요!",
                  },
                ]}
              >
                {/* suffix는 숫자 뒤에 추가적인 문자나 기호를 넣을 때 사용합니다. 이 경우에는 초(s)를 붙입니다. */}
                <InputNumber min={0} max={300} step={10} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  시작하기
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SqautSetting;