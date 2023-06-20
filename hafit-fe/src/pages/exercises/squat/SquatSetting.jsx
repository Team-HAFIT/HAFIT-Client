import React, { useState } from "react";
import { Form, InputNumber, Button, Card, Row, Col, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

import "../../../styles/pages/exercise/execSetting.css";

// import Header from "../../../components/MainNavbar";

const { Title } = Typography;

const SqautSetting = () => {
  const [loading, setLoading] = useState(false); // 요청 중 여부 상태 저장용 state
  const navigate = useNavigate(); // 페이지 이동을 위해 useNavigate hook 사용

  const accessToken = useSelector((state) => state.authToken.accessToken);

  const onFinish = (values) => {
    setLoading(true); // 요청 시작 시 로딩 중 상태로 설정

    const updatedValues = { ...values, exerciseId: 1 };
    axios
      .post("/api/plans", updatedValues, {
        headers: {
          "Content-Type": "application/json", // 요청 헤더에 Content-Type 설정
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 5000, // 요청 제한 시간 설정
      })
      .then((response) => {
        console.log(response.data); // 응답 결과 출력

        const planId = response.data.planId; // 응답 데이터에서 planId 추출
        navigate("/exec/squat", { state: { planId } }); // 이동 시, planId 값을 함께 전달
      })
      .catch((error) => {
        console.error(error);
        console.log(error.response);
        // if (error.response && error.response.status === 400) {
        //   alert("값을 확인해주세요.");
        // } else {
        //   alert("에러 발생"); // 기타 에러 발생 시 에러 메시지 띄우기
        // }
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
      {/* <Header /> */}
      <Row justify="center" style={{ height: "100vh", marginTop: "4rem" }}>
        <Col span={16} align="middle">
          <Title level={2} align="left">
            <span style={{ fontWeight: "bold" }}>스쿼트</span>
            <span style={{ marginLeft: "8px", fontSize: "21px" }}>| squat</span>
          </Title>
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
                name="plan_target_count"
                rules={[
                  {
                    required: true,
                    message: "목표 개수를 입력해주세요!",
                  },
                ]}
              >
                <InputNumber
                  className="exec-input"
                  min={1}
                  max={100}
                  step={5}
                  addonAfter="개"
                />
              </Form.Item>

              <Form.Item
                label="세트 수"
                name="plan_target_set"
                rules={[
                  {
                    required: true,
                    message: "세트 수를 입력해주세요!",
                  },
                ]}
              >
                <InputNumber
                  className="exec-input"
                  min={1}
                  max={20}
                  addonAfter="세트"
                />
              </Form.Item>

              <Form.Item
                label="중량"
                name="plan_weight"
                rules={[
                  {
                    required: true,
                    message: "중량을 입력해주세요!",
                  },
                ]}
              >
                {/* step은 숫자의 증감 단위를 설정하는데, 이 경우 5씩 증감합니다.*/}
                <InputNumber
                  className="exec-input"
                  min={1}
                  max={100}
                  step={5}
                  addonAfter="kg"
                />
              </Form.Item>

              <Form.Item
                label="휴식 시간"
                name="plan_rest_time"
                rules={[
                  {
                    required: true,
                    message: "휴식 시간을 입력해주세요!",
                  },
                ]}
              >
                <InputNumber
                  className="exec-input"
                  min={0}
                  max={1000}
                  step={10}
                  // suffix="초"
                  addonAfter="초"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  className="btn-submit"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  운동 시작하기
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
