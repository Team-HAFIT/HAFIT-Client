import React, { useState, useEffect } from "react";
import { Button, Input } from "antd";
import "../../styles/pages/restTimerPage.css";

const RestTimerPage = () => {
  const [timer, setTimer] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [selectedTime, setSelectedTime] = useState(0);
  const [inputTime, setInputTime] = useState(0);

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
  };

  const handleEndWorkout = () => {
    // End workout button functionality
  };

  return (
    <div className="rest-timer-container">
      <h1>{isExpired ? "휴식 시간이 종료되었습니다!" : "휴식시간 입니다!"}</h1>
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
        onClick={handleEndWorkout}
        disabled={!isExpired}
        className="action-button"
      >
        운동 끝내기
      </Button>
    </div>
  );
};

export default RestTimerPage;
