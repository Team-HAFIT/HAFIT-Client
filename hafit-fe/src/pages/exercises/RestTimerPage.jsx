import React, { useState, useEffect } from "react";
import { Button, Input, Modal } from "antd";
import { useLocation } from "react-router-dom";
import axios from 'axios'; // axios 호출
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// import Header from "../../components/MainNavbar";

import "../../styles/pages/restTimerPage.css";

const RestTimerPage = () => {
  const [timer, setTimer] = useState(15);
  const [isExpired, setIsExpired] = useState(false);
  const [selectedTime ,setSelectedTime] = useState(0);
  const [inputTime, setInputTime] = useState(0);
  const location = useLocation();
  const planId = location.state.planId;
  const realSet = location.state.realSet;
  const accessToken = useSelector((state) => state.authToken.accessToken); // 액세스 토큰 생성
  const navigate = useNavigate(); // 페이지 이동을 위해 useNavigate hook 사용

  useEffect(() => {
    axios  // planId로 플랜 계획 조회해오기
      .get(`/api/plans/${planId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        timeout: 10000,
      })
      .then((response) => {
        const plan = response.data;
        console.log(plan);
        setSelectedTime(plan.plan_rest_time);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [planId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      } else {
        setIsExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  const handleButtonClick = (time) => {
    setSelectedTime(time);
    setTimer(time);
    setIsExpired(false);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setInputTime(value);
  };

  const handleMinusClick = () => {
    if (inputTime > 0) {
      setInputTime((prevTime) => parseInt(prevTime) - 1);
    }
  };

  const handlePlusClick = () => {
    setInputTime((prevTime) => parseInt(prevTime) + 1);
  };

  const handleSetTime = () => {
    setTimer(inputTime);
    setSelectedTime(inputTime);
    setIsExpired(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleNextSet = () => {
    // Next set button functionality
    const data = { restTime : selectedTime, 
                   weight : 10,
                   plan : planId
                    };
    axios.put("/api/sets/rest", data, {
      headers: {
        "Content-Type": "application/json", // 요청 헤더에 Content-Type 설정
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 5000, // 요청 제한 시간 설정
    }).then((response) => {
      console.log(response.data); // 응답 결과 출력
      navigate("/exec/squat", { state: { planId, realSet : realSet + 1 } }); // 이동 시, planId 값을 함께 전달
    })
    .catch((error) => {
      console.error(error);
      console.log(error.response);
    })
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleEndWorkout = () => {
    setShowConfirmModal(true);
  };

  const handleOk = () => {
    setShowConfirmModal(false);
    window.location.href = "/exec/result";
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  return (
    <div>
      {/* <Header /> */}
      <div className="rest-timer-container">
        <h1>
          {isExpired ? "휴식 시간이 종료되었습니다!" : "휴식시간 입니다!"}
        </h1>
        <div className="button-group">
          <Button onClick={() => handleButtonClick(15)}>15초</Button>
          <Button onClick={() => handleButtonClick(30)}>30초</Button>
          <Button onClick={() => handleButtonClick(45)}>45초</Button>
          <Button onClick={() => handleButtonClick(60)}>1분</Button>
          <Button onClick={() => handleButtonClick(90)}>1분 30초</Button>
        </div>
        <div className="time-input-group">
          <Button onClick={handleMinusClick}>-</Button>
          <Input
            type="number"
            value={inputTime}
            onChange={handleInputChange}
            style={{ width: "50px", margin: "0 10px" }}
          />
          <Button onClick={handlePlusClick}>+</Button>
          <Button onClick={handleSetTime}>설정</Button>
        </div>
        <div className="timer-container">
          <h2 className={`timer ${isExpired ? "expired" : ""}`}>
            {formatTime(timer)}
          </h2>
        </div>
        <Button
          type="primary"
          onClick={handleNextSet}
          disabled={!isExpired}
          className="action-button"
        >
          다음 세트 시작하기
        </Button>
        <Button
          type="primary"
          className="action-button"
          onClick={handleEndWorkout}
        >
          운동 끝내기
        </Button>
        <Modal
          title="운동을 끝내시겠어요?"
          visible={showConfirmModal}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p></p>
        </Modal>
      </div>
    </div>
  );
};

export default RestTimerPage;

