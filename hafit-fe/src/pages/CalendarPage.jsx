import React, { useState } from 'react';
import { Calendar, Modal, Form, Input, Button, Checkbox, Select } from 'antd';
import moment from 'moment';
import '../styles/pages/calendarPage.css';

const { Option } = Select;

const CalendarPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [mainExercise, setMainExercise] = useState('');
  const [targetReps, setTargetReps] = useState('');
  const [targetSets, setTargetSets] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [repeatDays, setRepeatDays] = useState([]);
  const [exerciseSchedules, setExerciseSchedules] = useState([]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleModalSubmit = (values) => {
    const newSchedule = {
      date: selectedDate.format('YYYY-MM-DD'),
      exercise: values.subExercise,
      reps: values.targetReps,
      sets: values.targetSets,
      weight: targetWeight, // Use targetWeight state instead of values.targetWeight
      repeatDays: values.repeatDays || [], // Set default value if no repeat days are selected
      memo: values.memo,
    };
    setExerciseSchedules([...exerciseSchedules, newSchedule]);
    setModalVisible(false);
  };

  const exerciseOptions = {
    등: ['턱걸이', '데드리프트', '로우'],
    가슴: ['벤치프레스', '푸쉬업', '체스트플라이'],
    어깨: ['숄더프레스', '사이드 레터럴 레이즈', '프론트 레터럴 레이즈'],
    하체: ['스쿼트', '런지', '레그프레스'],
    팔: ['바이셉 컬', '트라이셉 딥스', '해머 컬'],
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

  const disabledDate = (current) => {
    // Disable past dates
    return current && current < moment().endOf('day');
  };

  const dateCellRender = (value) => {
    const schedules = exerciseSchedules.filter(
      (schedule) => schedule.date === value.format('YYYY-MM-DD')
    );

    const formatExerciseSummary = (schedule) => {
      return `${schedule.exercise} (${schedule.reps}회, ${schedule.sets}세트, ${schedule.weight}kg)`;
    };

    return (
      <ul className="date-cell-schedules">
        {schedules.map((schedule, index) => (
          <p key={index}>
              {schedule.exercise}  {schedule.reps}개 X {schedule.sets} 세트 ({schedule.weight}kg)
            </p>
        ))}
      </ul>
    );
  };

  const addExercise = (daysToAdd) => {
    const date = moment().add(daysToAdd, 'days');
    setSelectedDate(date);
    setModalVisible(true);
  };

  const renderExerciseSection = (title, daysToAdd) => {
    const date = moment().add(daysToAdd, 'days');
    const currentDayExercise = getCurrentDayExercise(date);

    return (
      <div className="exercise-section">
        <h2>{title}</h2>
        <div className="exercise-schedule">
          <Button onClick={() => addExercise(daysToAdd)}>+</Button>
          {currentDayExercise}
        </div>
      </div>
    );
  };

  const findExerciseScheduleByDate = (date) => {
    return exerciseSchedules.find(
      (schedule) => schedule.date === date.format('YYYY-MM-DD')
    );
  };

  const getCurrentDayExercise = (date) => {
    const todaySchedules = exerciseSchedules.filter(
      (schedule) => schedule.date === date.format('YYYY-MM-DD')
    );
  
    if (todaySchedules.length > 0) {
      return (
        <div>
          {todaySchedules.map((schedule, index) => (
            <p key={index}>
              {schedule.exercise}  {schedule.reps}개 X {schedule.sets} 세트 ({schedule.weight}kg)
            </p>
          ))}
        </div>
      );
    } else {
      return <p>일정이 없습니다.</p>;
    }
  };

  const renderCurrentDayExercise = (date) => {
    const todaySchedule = getCurrentDayExercise(date);
    return (
      <div className="exercise-schedules">
        <h2>{date.format('YYYY-MM-DD')} 운동 일정</h2>
        {todaySchedule}
      </div>
    );
  };

  return (
    <div className="container">
      <h1>운동 일정</h1>
      <div className="exercise-sections">
        {renderExerciseSection('오늘', 0)}
        {renderExerciseSection('내일', 1)}
        {renderExerciseSection('모레', 2)}
      </div>
      
      <div className="calendar">
        <Calendar
          onSelect={handleDateSelect}
          // disabledDate={disabledDate}
          dateCellRender={dateCellRender}
        />
      </div>
      <Modal
        title={`운동 일정 - ${selectedDate?.format('YYYY-MM-DD')}`}
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form onFinish={handleModalSubmit} layout="vertical">
          <Form.Item label="운동 선택">
            <Input.Group compact>
              <Form.Item
                name="mainExercise"
                noStyle
                rules={[{ required: true, message: '운동을 선택해주세요' }]}
              >
                <Select
                  placeholder="주 운동 선택"
                  onChange={handleExerciseSelect}
                  style={{ width: '50%' }}
                >
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
                rules={[{ required: true, message: '운동을 선택해주세요' }]}
              >
                <Select placeholder="부 운동 선택" style={{ width: '50%' }}>
                  {exerciseOptions[mainExercise]?.map((subExercise) => (
                    <Option key={subExercise} value={subExercise}>
                      {subExercise}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label="목표 개수">
            <Input.Group compact>
              <Form.Item
                name="targetReps"
                noStyle
                rules={[{ required: true, message: '목표 개수를 입력해주세요' }]}
              >
                <Input
                  style={{ width: '50%' }}
                  placeholder="개"
                  type="number"
                  min={1}
                  onChange={handleTargetRepsChange}
                />
              </Form.Item>
              <Form.Item
                name="targetSets"
                noStyle
                rules={[{ required: true, message: '목표 세트 수를 입력해주세요' }]}
              >
                <Input
                  style={{ width: '50%' }}
                  placeholder="세트"
                  type="number"
                  min={1}
                  onChange={handleTargetSetsChange}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label="목표 중량">
            <Input
              placeholder="kg"
              type="number"
              min={1}
              onChange={handleTargetWeightChange}
            />
          </Form.Item>
          <Form.Item label="반복 요일">
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
          <Form.Item label="메모">
            <Input.TextArea rows={3} name="memo" />
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
