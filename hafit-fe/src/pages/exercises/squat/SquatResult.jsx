import React from "react";
import { Button } from "antd";
import "../../../styles/pages/squatResult.css";

const SquatResult = () => {
  const currentDate = new Date();
  const currentDateString = `${currentDate.getFullYear()}. ${
    currentDate.getMonth() + 1
  }. ${currentDate.getDate()} - ${currentDate.getHours()}:${currentDate.getMinutes()}`;

  return (
    <div className="exercise-result-container">
      <div className="exercise-result-header">운동 목표를 달성했어요! 🎉</div>
      <div className="exercise-result-main">
        <div className="exercise-result-info">
          <div className="exercise-result-title">스쿼트 | Squat</div>
          <div className="exercise-result-date">{currentDateString}</div>
          <div className="exercise-result-sets">15개 / 5세트 ( 75개 )</div>
          <div className="exercise-result-time">운동 시간 00 : 25 : 30</div>
          <div className="exercise-result-calories">소모 칼로리 245 kcal</div>
          <div className="exercise-result-weight">무게(kg) 60 kg</div>
          <div className="exercise-result-intensity">
            운동 강도 😢 🙁 😐 🙂 😃
          </div>
        </div>
        <div className="exercise-result-buttons">
          <Button type="primary">홈으로</Button>
          <Button type="primary">결과 자세히 보기</Button>
        </div>
      </div>
    </div>
  );
};

export default SquatResult;
