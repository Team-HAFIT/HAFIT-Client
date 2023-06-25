import React, { useEffect, useState, useCallback } from "react";
import { Calendar, Modal, Form, Input, Button, message, Checkbox, DatePicker, Select } from 'antd';
import moment from 'moment';
import '../../../styles/pages/calendarPage.css';
import { useSelector } from "react-redux";
import axios from "axios";
const { Option } = Select;

const CalendarPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [mainExercise, setMainExercise] = useState('');
  const [targetReps, setTargetReps] = useState('');
  const [targetSets, setTargetSets] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [exerciseSchedules, setExerciseSchedules] = useState([]);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [goals, setGoals] = useState([]);
  const accessToken = useSelector((state) => state.authToken.accessToken);
  const [keywords, setKeywords] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [routineCount, setRoutineCount] = useState('');
  const [routineSet, setRoutineSet] = useState('');
  const [routineWeight, setRoutineWeight] = useState('');
  const [exerciseId, setExerciseId] = useState('');
  const [goalId, setGoalId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [repeatDays, setRepeatDays] = useState([]);
  const [routines, setRoutines] = useState([]);

  const fetchRoutines = useCallback(async () => {
    axios
      .get("/api/routines", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000,
      })
      .then((response) => {
        const routines = response.data;
        setRoutines(routines);
      })
      .catch((error) => {
        console.log(error);
        message.error("루틴 정보를 불러오지 못했습니다", 1);
      });
  }, [accessToken]);
  
  useEffect(() => {
    fetchRoutines();
  }, []);

  // 캘린더에서 해당 날짜에 운동 이름을 표시하는 함수
  const renderExerciseName = (date) => {
    const exercise = routines.find((item) => item.days === date);
    return exercise ? exercise.exerciseName : '';
  };

  const fetchGoals = useCallback(async () => {

    try {
      const response = await axios.get("/api/goals/my", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000,
      });
  
      const goals = response.data.goals;
      setGoals(prevGoals => prevGoals.concat(goals));
    } catch (error) {
      console.log(error);
      message.error("회원 정보를 불러오지 못했습니다", 1);
    } finally {
      // 추가적인 작업이 필요한 경우 여기에 작성합니다.
    }
  }, [accessToken]);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchKeywords  = useCallback(async () => {

    try {
      const response = await axios.get("/api/keywords", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000,
      });
      setKeywords(response.data);
    } catch (error) {
      console.log(error);
      message.error("키워드를 불러올 수 없습니다.", 1);
    } finally {
    }
  }, [accessToken]);

  useEffect(() => {
    fetchKeywords();
  }, []);  

  const handleKeywordChange = useCallback(async (keywordId) => {

    try {
      const response = await axios.get(`/api/exercises/keyword/${keywordId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000,
      });
      setExerciseList(response.data);
    } catch (error) {
      console.log(error);
      message.error("키워드를 불러올 수 없습니다.", 1);
    } finally {
    }
  }, [accessToken]);

  const renderGoalList = () => {
    return (
      <div className="pill-container">
        <ul className="goal-list">
          {goals.map((goal, index) => (
            <li key={index} className="goal-item">
              <p className="goal-content first-child">{goal.goal_target_date}</p>
              <p className="d-day last-child">{goal.goal_content}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  const handleAddGoal = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleExerciseClick = (exerciseId) => {
    setSelectedExerciseId(exerciseId);
  };

  const handleGoalSubmit = async (values) => {
    try {
      values.exerciseId = selectedExerciseId;
      values.goal_target_date = values.goal_target_date.format('YYYY-MM-DD');
      const goalResponse = await axios.post('/api/goals', values, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000,
      });

      console.log(goalResponse.data);
      const routineData = {
        ...values,
        goalId: goalResponse.data,
      };
      console.log(routineData);
      console.log(routineData);
      console.log(routineData);
      console.log(routineData);
      await axios.post('/api/routines', routineData, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000,
      });

      window.location.reload();
    } catch (error) {
      console.log(error);
      message.error('운동 목표를 추가할 수 없습니다.', 1);
    }
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

  const handleRoutineCountChange = (e) => {
    setRoutineCount(e.target.value);
  };

  const handleRoutineSetChange = (e) => {
    setRoutineSet(e.target.value);
  };

  const handleRoutineWeightChange = (e) => {
    setRoutineWeight(e.target.value);
  };

  const handleExerciseIdChange = (e) => {
    setExerciseId(e.target.value);
  };

  const handleGoalIdChange = (e) => {
    setGoalId(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleRepeatDaysChange = (checkedValues) => {
    setRepeatDays(checkedValues);
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

  const disabledDate = (current) => {
    // Disable past dates
    return current && current < moment().endOf('day');
  };

  const dateCellRender = (value) => {
    const exercises = routines.filter((routine) => routine.days === value.format('YYYY-MM-DD'));

    return (
      <ul className="date-cell-schedules">
        {exercises.map((exercise, index) => (
          <p key={index}>
            <div style={{ backgroundColor: 'lightgray', padding: '5px', borderRadius: '4px', marginBottom: '2px' }}>
              <div style={{ backgroundColor: '#9d6acd', color: 'white', padding: '5px', borderRadius: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>{exercise.exerciseName}</span>
                {exercise.perform === 'Y' && <span style={{ marginLeft: '5px' }}>&#128582;</span>}
              </div>
              {`${exercise.routineCount}개 x ${exercise.routineSet}세트${exercise.routineWeight !== null ? ` x ${exercise.routineWeight}kg` : ''}`}
            </div>
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
      <div className="calendar-page">
      {goals.length === 0 && <h1>운동 목표를 추가해 주세요 &#127947;</h1>}
        <div className="goal-list">
          {renderGoalList()}
        </div>
        <Button type="primary" onClick={handleAddGoal} style={{ display: goals.length >= 2 ? 'none' : 'block', marginBottom: '1em' }}>+</Button>
        <Modal
          title="운동 목표를 설정해 주세요 &#127947;"
          visible={showModal}
          onCancel={handleModalClose}
          footer={null}
        >
          <Form onFinish={handleGoalSubmit}>
            <Form.Item name="goal_target_date" label="목표 날짜" rules={[{ required: true, message: 'D-Day를 선택해 주세요.' }]}>
              <DatePicker disabledDate={disabledDate}/>
            </Form.Item>
            <Form.Item name="goal_content" label="운동 목표" rules={[{ required: true, message: '운동 목표를 입력해 주세요.' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="keywordId" label="키워드" rules={[{ required: true, message: '키워드를 선택해 주세요.' }]}>
              <Select onChange={handleKeywordChange}>
                {keywords.map((keyword) => (
                  <Select.Option key={keyword.keywordId} value={keyword.keywordId}>
                    {keyword.keyword_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              {exerciseList.map((exercise) => (
                <Button
                  key={exercise.exerciseId}
                  onClick={() => handleExerciseClick(exercise.exerciseId)}
                  style={{
                    fontWeight: selectedExerciseId === exercise.exerciseId ? 'bold' : 'normal',
                    backgroundColor: selectedExerciseId === exercise.exerciseId ? '#8A2BE2' : 'inherit',
                    color: selectedExerciseId === exercise.exerciseId ? '#eaeaea' : 'inherit'
                  }}
                >
                  {exercise.exerciseName}
                </Button>
              ))}
            </Form.Item>
            <Form.Item label="목표 개수">
            <Input.Group compact>
              <Form.Item
                name="routineCount"
                noStyle
                rules={[{ required: true, message: '목표 개수를 입력해주세요' }]}
              >
                <Input
                  style={{ width: '50%' }}
                  placeholder="개"
                  type="number"
                  min={1}
                  onChange={handleRoutineCountChange}
                />
              </Form.Item>
              <Form.Item
                name="routineSet"
                noStyle
                rules={[{ required: true, message: '목표 세트 수를 입력해주세요' }]}
              >
                <Input
                  style={{ width: '50%' }}
                  placeholder="세트"
                  type="number"
                  min={1}
                  onChange={handleRoutineSetChange}
                />
                </Form.Item>
              </Input.Group>
            </Form.Item>
            <Form.Item label="목표 중량" name="routineWeight"  required={false}>
              <Input
                placeholder="kg"
                type="number"
                min={1}
                onChange={handleRoutineWeightChange}
              />
            </Form.Item>
            <Form.Item label="반복 요일" name="repeatDays">
              <Checkbox.Group onChange={handleRepeatDaysChange}>
                <Checkbox value="MONDAY">월</Checkbox>
                <Checkbox value="TUESDAY">화</Checkbox>
                <Checkbox value="WEDNESDAY">수</Checkbox>
                <Checkbox value="THURSDAY">목</Checkbox>
                <Checkbox value="FRIDAY">금</Checkbox>
                <Checkbox value="SATURDAY">토</Checkbox>
                <Checkbox value="SUNDAY">일</Checkbox>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#8A2BE2' }}>확인</Button>
           </Form.Item>
          </Form> 
        </Modal>
      </div>

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
