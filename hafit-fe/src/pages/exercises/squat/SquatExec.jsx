import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import "../../../styles/pages/exercise/execPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // axios 호출
import { useSelector } from "react-redux";

import warningSound from "../../../assets/mp3/warning.mp3";

const Movenet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const planId = location.state.planId;
  const realSet = location.state.realSet;
  const detectorRef = useRef(null);
  const detectorConfigRef = useRef(null);
  const posesRef = useRef(null);
  const skeleton = true;
  const confidenceThreshold = 0.5; //정확도
  const minconfidenceThreshold = 0.3;
  let video, ctx, canvas; //세트 개수
  let hurrycheckpoint; //허리 체크 포인트
  let hurrycheck; //허리 값 변수
  let squatStarted = false; //스쿼트 위 아래 여부
  let squatFinished = false; //스쿼트 위 아래 여부
  let kneeAngleThreshold = 140; //무릎 각도(스쿼트)
  let orangeHurryAngleThreshold = 15; //허리 각도(굽혀경고)
  let redHurryAngleThreshold = 25; //허리 각도(굽혀짐)
  const accessToken = useSelector((state) => state.authToken.accessToken);
  let kneeAnglewarringThreshold  = 80;

  const [timer, setTimer] = useState(0); //타이머 변수
  const timerRef = useRef(null); //타이머 나타내는변수
  const [isPoseDetected, setIsPoseDetected] = useState(false); //포즈감지 여부 변수
  const [isOrangeDetected, setIsOrangeDetected] = useState(false); //허리 주의 여부 변수
  const [isRedDetected, setIsRedDetected] = useState(false); //허리 경고 여부 변수
  const startTimeRef = useRef(null); //타이머 시작변수
  const [squatCount, setSquatCount] = useState(0); //스쿼트 개수 변수
  const [currentSet, setCurrentSet] = useState(0); // 현재 세트 수
  const [totalSets, setTotalSets] = useState(5); // 전체 세트 수
  const [repsPerSet, setRepsPerSet] = useState(10); // 목표 개수
  const [weight, setWeight] = useState(10); // 무게
  const [startTime, setStartTime] = useState(new Date()); // 운동 시작 시간
  const [restTime, setRestTime] = useState(0); // 휴식 시간
  const [squatPercentage, setSquatPercentage] = useState(0); // 스쿼트 진행 퍼센테이지 변수
  const [iskneeDetected, setIskneeDetected] = useState(false);

  let realRepsPerSet = repsPerSet; // 목표 개수
  let realWeight = weight; // 목표 무게
  let realTime = new Date() - startTime; // 소요 시간
  let realTargetSet = 0; // 목표 세트

  const [redcount, setredcount]= useState(0);
  const [orangecount, setorangecount]= useState(0);
  const [excellentCount, setExcellentCount] = useState(0);
  const [goodCount, setGoodCount] = useState(0);
  const [badCount, setBadCount] = useState(0);

  const alertSoundRef = useRef(null); // 경고음
  const moduleRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const edges = {
    "5,7": "m",
    "5,17": "m",
    "6,17": "m",
    "7,9": "m",
    "6,8": "m",
    "8,10": "m",
    "11,13": "m",
    "13,15": "m",
    "12,14": "m",
    "14,16": "m",
    "17,18": "m",
    "18,19": "m",
    "19,20": "m",
    "12,20": "m",
    "11,20": "m",
  };

  const hurryCheckEdges = {
    "5,7": "m",
    "5,17": "m",
    "6,17": "m",
    "7,9": "m",
    "6,8": "m",
    "8,10": "m",
    "11,13": "m",
    "13,15": "m",
    "12,14": "m",
    "14,16": "m",
    "12,20": "m",
    "11,20": "m",
  };

  const hurryErrorEdges = {
    "17,18": "m",
    "18,19": "m",
    "19,20": "m",
  };

  useEffect(() => {
    alertSoundRef.current = new Audio(warningSound);
  }, []);

  useEffect(() => {
    init();
    startTimer();
    setCurrentSet(currentSet + 1);

    // 추가함
    axios // planId로 플랜 계획 조회해오기
      .get(`/api/plans/${planId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000,
      })
      .then((response) => {
        const plan = response.data;
        setWeight(plan.plan_weight);
        setTotalSets(plan.plan_target_set);
        setRepsPerSet(plan.plan_target_count);
        setRestTime(plan.plan_rest_time);
        realRepsPerSet = plan.plan_target_count;
        realWeight = plan.plan_weight;
        realTargetSet = plan.plan_target_set;
      })
      .catch((error) => {
        console.log(error);
      });
  }, [planId, realSet]);

  useEffect(() => {
    if (isRedDetected) {
      alertSoundRef.current.play();
    } else {
      alertSoundRef.current.pause();
      alertSoundRef.current.currentTime = 0;
    }
  }, [isRedDetected]);

  useEffect(() => {
    if (isPoseDetected) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [isPoseDetected]);

  const startTimer = () => {
    if (!timerRef.current) {
      startTimeRef.current = Date.now() - timer * 1000; // Subtract elapsed time from current time
      timerRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        setTimer(elapsedSeconds);
      }, 1000);
    }
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const init = async () => {
    tf.setBackend("webgl");
    detectorConfigRef.current = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
      enableSmoothing: true,
      enableSegmentation: true,
    };
    detectorRef.current = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfigRef.current
    );
    setup();
    draw();
  };

  const setup = async () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    video = videoRef.current;

    const camera = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    video.srcObject = camera;

    video.addEventListener("loadeddata", () => {
      video.play();
    });

    const onLoadedMetadata = () => {
      // Start detecting poses once the video dimensions are set.
      getPoses();
    };
    video.addEventListener("loadedmetadata", onLoadedMetadata);
  };

  const getPoses = async () => {
    posesRef.current = await detectorRef.current.estimatePoses(video);
    setTimeout(getPoses, 5);
    if (posesRef.current && posesRef.current.length > 0) {
      setIsPoseDetected(true);
      const leftShoulder = posesRef.current[0].keypoints[5];
      const rightShoulder = posesRef.current[0].keypoints[6];
      const leftHip = posesRef.current[0].keypoints[11];
      const rightHip = posesRef.current[0].keypoints[12];
      const midShoulderX = (leftShoulder.x + rightShoulder.x) / 2;
      const midShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
      const midHipX = (leftHip.x + rightHip.x) / 2;
      const midHipY = (leftHip.y + rightHip.y) / 2;
      const middleShoulder = {
        x: midShoulderX,
        y: midShoulderY,
        score: Math.min(leftShoulder.score, rightShoulder.score),
      };
      posesRef.current[0].keypoints[17] = {
        x: midShoulderX,
        y: midShoulderY,
        score: Math.min(leftShoulder.score, rightShoulder.score),
      };
      const midhip = {
        x: midHipX,
        y: midHipY,
        score: Math.min(leftHip.score, rightHip.score),
      };
      posesRef.current[0].keypoints[20] = {
        x: midHipX,
        y: midHipY,
        score: Math.min(leftHip.score, rightHip.score),
      };
      const x1 = middleShoulder.x;
      const y1 = middleShoulder.y;
      const x2 = posesRef.current[0].keypoints[20].x;
      const y2 = posesRef.current[0].keypoints[20].y;
      const x1_3 = (2 * x1 + x2) / 3;
      const y1_3 = (2 * y1 + y2) / 3;
      const x2_3 = (x1 + 2 * x2) / 3;
      const y2_3 = (y1 + 2 * y2) / 3;
      posesRef.current[0].keypoints[18] = {
        x: x1_3,
        y: y1_3,
        score: Math.min(leftShoulder.score, rightShoulder.score),
      };
      posesRef.current[0].keypoints[19] = {
        x: x2_3,
        y: y2_3,
        score: Math.min(leftHip.score, rightHip.score),
      };
      hurrycheckpoint = {
        x: midHipX,
        y: midShoulderY,
        score: Math.min(midhip.score, middleShoulder.score),
      };
      hurrycheck = calculateAngle(middleShoulder, midhip, hurrycheckpoint);
    } else {
      setIsPoseDetected(false);
      setSquatPercentage(0);
    }
  };

  const draw = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);

    ctx.drawImage(video, 0, 0, video.width, video.height);

    drawKeypoints();
    if (skeleton) {
      drawSkeleton();
    }

    ctx.restore();
    ctx.fillStyle = "blue";
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.font = "30px Arial";
    ctx.save();

    if (posesRef.current && posesRef.current.length > 0) {
      countSquats();
    } else {
    }
    ctx.restore();
    window.requestAnimationFrame(draw);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const drawKeypoints = () => {
    let count = 0;
    if (posesRef.current && posesRef.current.length > 0) {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const originalWidth = video.videoWidth;
      const originalHeight = video.videoHeight;
      const widthRatio = canvasWidth / originalWidth;
      const heightRatio = canvasHeight / originalHeight;
      ctx.save();

      ctx.font = "10px Arial";

      for (let i = 0; i < posesRef.current[0].keypoints.length; i++) {
        const { x, y, score } = posesRef.current[0].keypoints[i];
        const adjustedX = x * widthRatio;
        const adjustedY = y * heightRatio;
        if (score > confidenceThreshold) {
          count = count + 1;
          if (i === 13 || i === 14) {
            const leftHip = posesRef.current[0].keypoints[11];
            const rightHip = posesRef.current[0].keypoints[12];
            const leftKnee = posesRef.current[0].keypoints[13];
            const rightKnee = posesRef.current[0].keypoints[14];
            const leftAnkle = posesRef.current[0].keypoints[15];
            const rightAnkle = posesRef.current[0].keypoints[16];
            const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
            const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
            
            const kneeKeypointsConfident = posesRef.current[0].keypoints
            .slice(15, 16)
            .every((kp) => kp.score > 0.3);
            if(kneeKeypointsConfident){
              if (leftKneeAngle <= kneeAnglewarringThreshold || rightKneeAngle <= kneeAnglewarringThreshold) {
                setIskneeDetected(true)
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(adjustedX, adjustedY, 30, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
              }
              else{
                setIskneeDetected(true)
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(adjustedX, adjustedY, 8, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
              }
            }
          }
          else {
            setIskneeDetected(false)
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(adjustedX, adjustedY, 8, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    } else {
    }
  };

  const drawSkeleton = () => {
    setIsOrangeDetected(false);
    setIsRedDetected(false);

    if (posesRef.current && posesRef.current.length > 0) {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const originalWidth = video.videoWidth;
      const originalHeight = video.videoHeight;
      const widthRatio = canvasWidth / originalWidth;
      const heightRatio = canvasHeight / originalHeight;

      const hurryKeypointsConfident = posesRef.current[0].keypoints
        .slice(16, 20)
        .every((kp) => kp.score > minconfidenceThreshold);

      if (
        hurryKeypointsConfident &&
        hurrycheck > orangeHurryAngleThreshold &&
        hurrycheck <= redHurryAngleThreshold
      ) {
        setIsOrangeDetected(true);
        setIsRedDetected(false);

        for (const [key, value] of Object.entries(hurryCheckEdges)) {
          const p = key.split(",");
          const p1 = parseInt(p[0]);
          const p2 = parseInt(p[1]);
          const kp1 = posesRef.current[0].keypoints[p1];
          const kp2 = posesRef.current[0].keypoints[p2];
          const x1 = kp1.x * widthRatio;
          const y1 = kp1.y * heightRatio;
          const c1 = kp1.score;
          const x2 = kp2.x * widthRatio;
          const y2 = kp2.y * heightRatio;
          const c2 = kp2.score;

          if (c1 > minconfidenceThreshold && c2 > minconfidenceThreshold) {
            ctx.strokeStyle = "rgb(0, 255, 0)"; // Green color
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }

        for (const [key, value] of Object.entries(hurryErrorEdges)) {
          const p = key.split(",");
          const p1 = parseInt(p[0]);
          const p2 = parseInt(p[1]);
          const kp1 = posesRef.current[0].keypoints[p1];
          const kp2 = posesRef.current[0].keypoints[p2];
          const x1 = kp1.x * widthRatio;
          const y1 = kp1.y * heightRatio;
          const c1 = kp1.score;
          const x2 = kp2.x * widthRatio;
          const y2 = kp2.y * heightRatio;
          const c2 = kp2.score;

          if (c1 > minconfidenceThreshold && c2 > minconfidenceThreshold) {
            ctx.strokeStyle = "rgb(255, 165, 0)"; // Orange color
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            setorangecount((prevCount) => prevCount + 1);
          }
        }
      } else if (
        hurryKeypointsConfident &&
        hurrycheck > redHurryAngleThreshold
      ) {
        setIsOrangeDetected(false);
        setIsRedDetected(true);

        for (const [key, value] of Object.entries(hurryCheckEdges)) {
          const p = key.split(",");
          const p1 = parseInt(p[0]);
          const p2 = parseInt(p[1]);
          const kp1 = posesRef.current[0].keypoints[p1];
          const kp2 = posesRef.current[0].keypoints[p2];
          const x1 = kp1.x * widthRatio;
          const y1 = kp1.y * heightRatio;
          const c1 = kp1.score;
          const x2 = kp2.x * widthRatio;
          const y2 = kp2.y * heightRatio;
          const c2 = kp2.score;

          if (c1 > minconfidenceThreshold && c2 > minconfidenceThreshold) {
            ctx.strokeStyle = "rgb(0, 255, 0)"; // Green color
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }

        for (const [key, value] of Object.entries(hurryErrorEdges)) {
          const p = key.split(",");
          const p1 = parseInt(p[0]);
          const p2 = parseInt(p[1]);
          const kp1 = posesRef.current[0].keypoints[p1];
          const kp2 = posesRef.current[0].keypoints[p2];
          const x1 = kp1.x * widthRatio;
          const y1 = kp1.y * heightRatio;
          const c1 = kp1.score;
          const x2 = kp2.x * widthRatio;
          const y2 = kp2.y * heightRatio;
          const c2 = kp2.score;

          if (c1 > minconfidenceThreshold && c2 > minconfidenceThreshold) {
            ctx.strokeStyle = "rgb(255, 0, 0)"; // Red color
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      } else {
        for (const [key, value] of Object.entries(edges)) {
          setIsOrangeDetected(false);
          setIsRedDetected(false);

          const p = key.split(",");
          const p1 = parseInt(p[0]);
          const p2 = parseInt(p[1]);
          const kp1 = posesRef.current[0].keypoints[p1];
          const kp2 = posesRef.current[0].keypoints[p2];
          const x1 = kp1.x * widthRatio;
          const y1 = kp1.y * heightRatio;
          const c1 = kp1.score;
          const x2 = kp2.x * widthRatio;
          const y2 = kp2.y * heightRatio;
          const c2 = kp2.score;

          if (c1 > minconfidenceThreshold && c2 > minconfidenceThreshold) {
            ctx.strokeStyle = "rgb(0, 255, 0)"; // Green color
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }
    } else {
      setIsOrangeDetected(false);
      setIsRedDetected(false);
    }
  };

  const countSquats = () => {
    const kneeKeypointsConfident = posesRef.current[0].keypoints
      .slice(10, 16)
      .every((kp) => kp.score > minconfidenceThreshold);
    if (kneeKeypointsConfident) {
      setSquatPercentage(0);
      const leftHip = posesRef.current[0].keypoints[11];
      const rightHip = posesRef.current[0].keypoints[12];
      const leftKnee = posesRef.current[0].keypoints[13];
      const rightKnee = posesRef.current[0].keypoints[14];
      const leftAnkle = posesRef.current[0].keypoints[15];
      const rightAnkle = posesRef.current[0].keypoints[16];
      const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
      const squatPercentage = calculateSquatPercentage(
        leftKneeAngle,
        rightKneeAngle
      );
      setSquatPercentage(squatPercentage);
      if (
        !squatStarted &&
        leftKneeAngle <= kneeAngleThreshold &&
        rightKneeAngle <= kneeAngleThreshold
      ) {
        squatStarted = true;
        squatFinished = false;
      }
      if (
        squatStarted &&
        leftKneeAngle > kneeAngleThreshold &&
        rightKneeAngle > kneeAngleThreshold
      ) {
        if(redcount > 0 && orangecount > 0){
          setBadCount((prevCount) => prevCount + 1);
          setredcount(0)
          setorangecount(0)
        }else if (redcount == 0 && orangecount > 0){
          setGoodCount((prevCount) => prevCount + 1);
          setredcount(0)
          setorangecount(0)
        }else{
          setExcellentCount((prevCount) => prevCount + 1);
          setredcount(0)
          setorangecount(0)
        }
        setSquatCount((prevCount) => {
          console.log(
            "squatCount : " +
              (prevCount + 1) +
              ", repsPerSet : " +
              realRepsPerSet
          );
          if (prevCount + 1 === realRepsPerSet) {
            realTime = (new Date() - startTime) / 1000;
            const data = {
              // 휴식 시간은 휴식 화면 끝나고 삽입
              realCount: prevCount + 1,
              realSet: realSet,
              realTime: realTime,
              weight: realWeight,
              plan: planId,
              startTime: startTime,
              limitTime: weight * (prevCount + 1),
              score: 100,
            };

            axios
              .post("/api/sets", data, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                timeout: 10000,
              })
              .then((response) => {
                console.log("전송 성공:", response.data);
                if (realSet === realTargetSet) {
                  navigate("/exec/result", { state: { planId: planId } });
                  window.location.reload();
                } else {
                  navigate("/exec/rest", {
                    state: { planId: planId, realSet: realSet },
                  });
                }
              })
              .catch((error) => {
                console.error("전송 실패:", error);
              });
          }

          return (prevCount += 1);
        });
        squatStarted = false;
        squatFinished = true;
      }
      if (squatCount > 0 && squatFinished) {
        console.log(`스쿼트 ${squatCount}회 완료!`);
        squatFinished = false;
      }
    } else {
      setSquatPercentage(0);
    }
  };

  const calculateAngle = (p1, p2, p3) => {
    let dx1 = p1.x - p2.x;
    let dy1 = p1.y - p2.y;
    let dx2 = p3.x - p2.x;
    let dy2 = p3.y - p2.y;
    let dot = dx1 * dx2 + dy1 * dy2;
    let mag1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    let mag2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    let angle = Math.acos(dot / (mag1 * mag2));
    return angle * (180.0 / Math.PI);
  };

  const calculateSquatPercentage = (leftKneeAngle, rightKneeAngle) => {
    const maxKneeAngle = 180; // 최대 무릎 각도 (완전히 선 상태)
    const squatKneeAngle = 140; // 스쿼트 완료 상태의 무릎 각도
    const maxPercentage = 100; // 최대 퍼센테이지

    const leftPercentage =
      ((maxKneeAngle - leftKneeAngle) / (maxKneeAngle - squatKneeAngle)) *
      maxPercentage;
    const rightPercentage =
      ((maxKneeAngle - rightKneeAngle) / (maxKneeAngle - squatKneeAngle)) *
      maxPercentage;

    const percentage = Math.min(leftPercentage, rightPercentage, maxPercentage);

    const formattedPercentage = percentage.toFixed(0);

    return formattedPercentage;
  };

  return (
    <div id='container'>
      <div id="state" style={{ width: 1152, height: 864 }}>
        <div id="headstate">
            <div id="countstate">
              <div id="count">
                <span id="textA">개수</span>
                <span id="textB">{squatCount}</span>
                <span id="textC">/ {repsPerSet}</span>
              </div>
            </div>
            <div id ="setstate">
              <div id="shapeContainer">
                {Array.from({ length: totalSets }, (_, index) => (
                  <div
                    key={index}
                    className={index < realSet ? 'shape completed' : 'shape'}
                  ></div>
                ))}
              </div>
            </div>
            <div id = "timerstate">
              <div id="timer">
                <span id="textD">운동 시간 </span>
                <span id="textD">{formatTime(timer)}</span>
              </div>
            </div>
        </div>
        <div id="mainstate">
          <div id="main1">
            <div id= "Excellentstate">
              <div id = "Excellent">
                <span id="textE">Excellent</span>
              </div>  
            </div>
            <div id= "goodstate">
              <div id="good">
                <span id="textE">good</span>
              </div>
            </div>
            <div id= "badstate">
              <div id="bad">
                <span id="textE">bad</span>
              </div>
            </div>
          </div>
          <div id="main2">
            <div id="kneecheck">
              <div id="kneeyes" style={{ display: iskneeDetected ? 'none' : 'block' }}></div>
              <div id="kneeno" style={{ display: iskneeDetected ? 'block' : 'none' }}>무릎이 너무 굽혀졌습니다.</div>
            </div>
            <div id="hurrycheck">
              <div id="orangeyes" style={{ display: isOrangeDetected ? 'none' : 'block' }}></div>
              <div id="orangeno" style={{ display: isOrangeDetected ? 'block' : 'none' }}>허리가 굽혀집니다 주의해주세요</div>
              <div id="redyes" style={{ display: isRedDetected ? 'none' : 'block' }}></div>
              <div id="redno" style={{ display: isRedDetected ? 'block' : 'none' }}>허리가 너무굽혀졌습니다.</div>
            </div>
            <div id="checkpose">
              <div id="poseyes" style={{ display: isPoseDetected ? 'block' : 'none' }}></div>
              <div id="poseno" style={{ display: isPoseDetected ? 'none' : 'block' }}>포즈감지가 불안정합니다.</div>
            </div>   
          </div>
          <div id="main3">
              <div id ="percent_text" >
                {squatPercentage}%
              </div>
              <div id="progress">
                <div id="progress-bar">
                <div id="progress-state-none" 
                  style={{ width: '100%', height: `calc(100% - ${squatPercentage}%)` }}
                  >
                  </div>
                  <div id="progress-state"></div>
                </div>
              </div>
            <div id="close"><button id="closebtn">종료</button></div>
          </div>
        </div>
      </div>
      <div id="module" ref={moduleRef}>
        <video id="webcam" ref={videoRef} width="1152" height="864" style={{ width: 1152, height: 864 }} autoPlay muted></video>
        <canvas id="movenet_Canvas" ref={canvasRef} width="1152" height="864" style={{ width: 1152, height: 864 }}></canvas>
      </div>
    </div>
  );
};

export default Movenet;