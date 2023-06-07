import React, { useState } from "react";
import { Calendar, Modal, Form, Input, Button, Checkbox, Select } from "antd";

import "../styles/pages/calendarPage.css";

const { Option } = Select;

const CalendarPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [mainExercise, setMainExercise] = useState("");
  const [targetReps, setTargetReps] = useState("");
  const [targetSets, setTargetSets] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [repeatDays, setRepeatDays] = useState([]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleModalSubmit = (values) => {
    console.log("Submitted values:", values);
    setModalVisible(false);
  };

  const exerciseOptions = {
    등: ["Exercise 1", "Exercise 2", "Exercise 3"],
    가슴: ["Exercise 4", "Exercise 5", "Exercise 6"],
    어깨: ["Exercise 7", "Exercise 8", "Exercise 9"],
    하체: ["Exercise 10", "Exercise 11", "Exercise 12"],
    팔: ["Exercise 13", "Exercise 14", "Exercise 15"],
  };

  const handleExerciseSelect = (value) => {
    setMainExercise(value);
  };

  const handleTargetRepsChange = (e) => {
    setTargetReps(e.target.value);
  };

  const handleTargetSetsChange = (e) => {
    setTargetSets(e.target.value);
  };

  const handleTargetWeightChange = (e) => {
    setTargetWeight(e.target.value);
  };

  const handleRepeatDaysChange = (checkedValues) => {
    setRepeatDays(checkedValues);
  };

  return (
    <div className="container">
      <h1>운동 일정</h1>
      <div className="calendar">
        <Calendar onSelect={handleDateSelect} />
      </div>

      <Modal
        title={`운동 일정 - ${selectedDate?.format("YYYY-MM-DD")}`}
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form onFinish={handleModalSubmit} layout="vertical">
          <Form.Item label="운동 선택">
            <Form.Item
              name="mainExercise"
              noStyle
              rules={[{ required: true, message: "운동을 선택해주세요" }]}
            >
              <Select placeholder="주 운동 선택" onChange={handleExerciseSelect}>
                {Object.keys(exerciseOptions).map((mainExercise) => (
                  <Option key={mainExercise} value={mainExercise}>
                    {mainExercise}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="subExercise"
              noStyle
              rules={[{ required: true, message: "운동을 선택해주세요" }]}
            >
              <Select placeholder="부 운동 선택">
                {exerciseOptions[mainExercise]?.map((subExercise) => (
                  <Option key={subExercise} value={subExercise}>
                    {subExercise}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form.Item>
          <Form.Item label="목표 개수">
            <Input.Group compact>
              <Form.Item
                name="targetReps"
                noStyle
                rules={[{ required: true, message: "목표 개수를 입력해주세요" }]}
              >
                <Input
                  style={{ width: "50%" }}
                  placeholder="목표 개수"
                  type="number"
                  min={1}
                />
              </Form.Item>
              <Form.Item
                name="targetSets"
                noStyle
                rules={[{ required: true, message: "목표 세트 수를 입력해주세요" }]}
              >
                <Input
                  style={{ width: "50%" }}
                  placeholder="목표 세트 수"
                  type="number"
                  min={1}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label="목표 중량 (kg)">
            <Form.Item
              name="targetWeight"
              noStyle
              rules={[{ required: true, message: "목표 중량을 입력해주세요" }]}
            >
              <Input
                placeholder="목표 중량"
                type="number"
                min={0}
                addonAfter="kg"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="반복 요일">
            <Form.Item
              name="repeatDays"
              noStyle
              rules={[{ required: true, message: "반복 요일을 선택해주세요" }]}
            >
              <Checkbox.Group onChange={handleRepeatDaysChange}>
                <Checkbox value="월">월</Checkbox>
                <Checkbox value="화">화</Checkbox>
                <Checkbox value="수">수</Checkbox>
                <Checkbox value="목">목</Checkbox>
                <Checkbox value="금">금</Checkbox>
                <Checkbox value="토">토</Checkbox>
                <Checkbox value="일">일</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Form.Item>
          <Form.Item label="메모">
            <Form.Item
              name="memo"
              noStyle
              rules={[{ required: true, message: "메모를 입력해주세요" }]}
            >
              <Input.TextArea placeholder="메모 입력" />
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              저장
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CalendarPage;

