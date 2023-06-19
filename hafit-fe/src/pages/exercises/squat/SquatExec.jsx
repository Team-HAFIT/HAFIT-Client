import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import axios from "axios";
import { useSelector } from "react-redux";
import '../../../styles/pages/exercise/execPage.css';

let SquatExec = () => {
  let accessToken = useSelector((state) => state.authToken.accessToken);

  let detector;
  let detectorConfig;
  let poses;
  let skeleton = true;
  let confidence_threshold = 0.5;
  let video, ctx, canvas;
  let hurrycheckpoint;
  let hurrycheck;

  let squatStarted = false;
  let squatFinished = false;
  let kneeAngleThreshold = 130;
  let orangehurryAngleThreshold = 30;
  let redhurryAngleThreshold = 50;
  let currentSet = 1; // 현재 세트
  let repsPerSet = 10; // 목표 횟수
  let totalSets = 3; // 목표 세트
  let bad = 100; // 점수
  let plan = 0; // 플랜 객체(planId)
  let today = new Date(); // 날짜 생성을 위한 객체 생성
  let startTime = today.getFullYear() + "-"; // 년도
  if (today.getMonth() + 1 < 10) {
    startTime += "0";
  }
  startTime += today.getMonth() + 1 + "-"; // 월
  if (today.getDate() < 10) {
    startTime += "0";
  }
  startTime += today.getDate() + " "; // 일
  if (today.getHours() < 10) {
    startTime += "0";
  }
  startTime += today.getHours() + ":"; // 시
  if (today.getMinutes() < 10) {
    startTime += "0";
  }
  startTime += today.getMinutes() + ":"; // 분
  if (today.getSeconds() < 10) {
    startTime += "0";
  }
  startTime += today.getSeconds(); // 초

  let [reps, setReps] = useState();
  let [ts, setTs] = useState();
  let [rt, setRt] = useState();
  let [we, setWe] = useState();
  let [pl, setPl] = useState();
  let [cs, setCs] = useState();

  let planId = 1;   
  useEffect(() => {
    axios
      .get(`/api/sets/${planId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000,
      })
      .then((response) => {
        let data = response.data;
        console.log(data);
        setReps(data.targetCount);
        setTs(data.targetSet);
        setRt(data.restTime);
        setWe(data.weight);
        setPl(data.plan);
        setCs(data.realSet || null);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [accessToken, planId]);

  useEffect(() => {
    if (cs != null) {
      repeatSetting(reps, ts, rt, we, pl, cs);
    } else {
      startSetting(reps, ts, rt, we, pl);
    }
  }, [cs]);
  let limitTime = 10000;

  let videoRef = useRef(null);
  let canvasRef = useRef(null);

  let [timer, setTimer] = useState(0);
  let timerRef = useRef(null);
  let [isPoseDetected, setIsPoseDetected] = useState(false);
  let startTimeRef = useRef(null);
  let [squatCount, setSquatCount] = useState(0);

  let edges = {
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

  let hurry_check_edges = {
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

  let hurry_error_edges = {
    "17,18": "m",
    "18,19": "m",
    "19,20": "m",
  };

  useEffect(() => {
    init();
    startTimer();
  }, []);

  useEffect(() => {
    if (isPoseDetected) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [isPoseDetected]);

  // 타이머 시작
  let startTimer = () => {
    if (!timerRef.current) {
      startTimeRef.current = Date.now() - timer * 1000; // Subtract elapsed time from current time
      timerRef.current = setInterval(() => {
        let elapsedSeconds = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        setTimer(elapsedSeconds);
      }, 1000);
    }
  };

  // 타이머 정지
  let stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  let init = async () => {
    tf.setBackend("webgpu");
    detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
      enableSmoothing: true,
      enableSegmentation: false,
    };
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
    setup();
    draw();
  };

  let setup = async () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    video = videoRef.current;

    let camera = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    video.srcObject = camera;

    // Add an event listener for the 'loadeddata' event
    video.addEventListener("loadeddata", () => {
      video.play();
    });

    let onLoadedMetadata = () => {
      // Start detecting poses once the video dimensions are set.
      getPoses();
    };
    video.addEventListener("loadedmetadata", onLoadedMetadata);
  };

  let getPoses = async () => {
    poses = await detector.estimatePoses(video);
    setTimeout(getPoses, 0);

    if (poses && poses.length > 0) {
      setIsPoseDetected(true);
      let leftShoulder = poses[0].keypoints[5];
      let rightShoulder = poses[0].keypoints[6];
      let leftHip = poses[0].keypoints[11];
      let rightHip = poses[0].keypoints[12];
      let midShoulderX = (leftShoulder.x + rightShoulder.x) / 2;
      let midShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
      let midHipX = (leftHip.x + rightHip.x) / 2;
      let midHipY = (leftHip.y + rightHip.y) / 2;
      let middleShoulder = {
        x: midShoulderX,
        y: midShoulderY,
        score: Math.min(leftShoulder.score, rightShoulder.score),
      };
      poses[0].keypoints[17] = {
        x: midShoulderX,
        y: midShoulderY,
        score: Math.min(leftShoulder.score, rightShoulder.score),
      };
      let midhip = {
        x: midHipX,
        y: midHipY,
        score: Math.min(leftHip.score, rightHip.score),
      };
      poses[0].keypoints[20] = {
        x: midHipX,
        y: midHipY,
        score: Math.min(leftHip.score, rightHip.score),
      };
      let x1 = middleShoulder.x;
      let y1 = middleShoulder.y;
      let x2 = poses[0].keypoints[20].x;
      let y2 = poses[0].keypoints[20].y;
      let x1_3 = (2 * x1 + x2) / 3;
      let y1_3 = (2 * y1 + y2) / 3;
      let x2_3 = (x1 + 2 * x2) / 3;
      let y2_3 = (y1 + 2 * y2) / 3;
      poses[0].keypoints[18] = {
        x: x1_3,
        y: y1_3,
        score: Math.min(leftShoulder.score, rightShoulder.score),
      };
      poses[0].keypoints[19] = {
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
    }
  };

  // 운동 계획에서 넘어왔을 때
  function startSetting(reps, ts, restT, we, pl) {
    repsPerSet = reps;
    totalSets = ts;
    rt = restT;
    we = we;
    plan = pl;
    limitTime = repsPerSet * we * 100;
  }

  // 휴식 화면에서 넘어왔을 때
  function repeatSetting(reps, ts, restT, we, pl, cs) {
    repsPerSet = reps;
    totalSets = ts;
    rt = restT;
    we = we;
    plan = pl;
    currentSet = cs;
    limitTime = repsPerSet * we * 100;
  }

  let draw = () => {
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

    if (poses && poses.length > 0) {
      countSquats();
    } else {
    }
    ctx.restore();
    window.requestAnimationFrame(draw);
  };

  let drawShapes = (ctx) => {
    let centerX = 450; // 중심 X 좌표
    let centerY = 40; // 중심 Y 좌표
    let radius = 25; // 원의 반지름
    let gap = 20; // 원과 원 사이의 간격

    let originalStrokeStyle = ctx.strokeStyle;

    for (let i = 0; i < totalSets; i++) {
      let x = centerX + (radius * 2 + gap) * i;
      let y = centerY;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);

      if (i < currentSet) {
        ctx.fillStyle = "green"; // 완료된 세트에 초록색으로 채우기
      } else {
        ctx.fillStyle = "white";
      }
      ctx.strokeStyle = "yellow"; // Set stroke color to yellow
      ctx.fill();
      ctx.stroke();
    }
    ctx.strokeStyle = originalStrokeStyle;
  };

  let drawKeypoints = () => {
    var count = 0;
    if (poses && poses.length > 0) {
      let canvasWidth = canvas.width;
      let canvasHeight = canvas.height;
      let originalWidth = video.videoWidth;
      let originalHeight = video.videoHeight;
      let widthRatio = canvasWidth / originalWidth;
      let heightRatio = canvasHeight / originalHeight;
      ctx.save();

      ctx.font = "10px Arial";

      for (let kp of poses[0].keypoints) {
        let { x, y, score } = kp;
        let adjustedX = x * widthRatio;
        let adjustedY = y * heightRatio;
        if (score > confidence_threshold) {
          count = count + 1;
          ctx.fillStyle = "white";
          ctx.strokeStyle = "black";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(adjustedX, adjustedY, 8, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        }
      }
      ctx.restore();
    } else {
    }
  };

  let drawSkeleton = () => {
    if (poses && poses.length > 0) {
      let canvasWidth = canvas.width;
      let canvasHeight = canvas.height;
      let originalWidth = video.videoWidth;
      let originalHeight = video.videoHeight;
      let widthRatio = canvasWidth / originalWidth;
      let heightRatio = canvasHeight / originalHeight;

      if (
        hurrycheck > orangehurryAngleThreshold &&
        hurrycheck <= redhurryAngleThreshold
      ) {
        for (let [key, value] of Object.entries(hurry_check_edges)) {
          let p = key.split(",");
          let p1 = parseInt(p[0]);
          let p2 = parseInt(p[1]);
          let kp1 = poses[0].keypoints[p1];
          let kp2 = poses[0].keypoints[p2];
          let x1 = kp1.x * widthRatio;
          let y1 = kp1.y * heightRatio;
          let c1 = kp1.score;
          let x2 = kp2.x * widthRatio;
          let y2 = kp2.y * heightRatio;
          let c2 = kp2.score;
          if (c1 > confidence_threshold && c2 > confidence_threshold) {
            ctx.strokeStyle = "rgb(0, 255, 0)"; // 초록색
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
        for (let [key, value] of Object.entries(hurry_error_edges)) {
          let p = key.split(",");
          let p1 = parseInt(p[0]);
          let p2 = parseInt(p[1]);
          let kp1 = poses[0].keypoints[p1];
          let kp2 = poses[0].keypoints[p2];
          let x1 = kp1.x * widthRatio;
          let y1 = kp1.y * heightRatio;
          let c1 = kp1.score;
          let x2 = kp2.x * widthRatio;
          let y2 = kp2.y * heightRatio;
          let c2 = kp2.score;
          if (c1 > confidence_threshold && c2 > confidence_threshold) {
            ctx.strokeStyle = "rgb(255, 165, 0)"; // 주황색
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            bad -= 5;
          }
        }
      } else if (hurrycheck > redhurryAngleThreshold) {
        for (let [key, value] of Object.entries(hurry_check_edges)) {
          let p = key.split(",");
          let p1 = parseInt(p[0]);
          let p2 = parseInt(p[1]);
          let kp1 = poses[0].keypoints[p1];
          let kp2 = poses[0].keypoints[p2];
          let x1 = kp1.x * widthRatio;
          let y1 = kp1.y * heightRatio;
          let c1 = kp1.score;
          let x2 = kp2.x * widthRatio;
          let y2 = kp2.y * heightRatio;
          let c2 = kp2.score;
          if (c1 > confidence_threshold && c2 > confidence_threshold) {
            ctx.strokeStyle = "rgb(0, 255, 0)"; // 초록색
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
        for (let [key, value] of Object.entries(hurry_error_edges)) {
          let p = key.split(",");
          let p1 = parseInt(p[0]);
          let p2 = parseInt(p[1]);
          let kp1 = poses[0].keypoints[p1];
          let kp2 = poses[0].keypoints[p2];
          let x1 = kp1.x * widthRatio;
          let y1 = kp1.y * heightRatio;
          let c1 = kp1.score;
          let x2 = kp2.x * widthRatio;
          let y2 = kp2.y * heightRatio;
          let c2 = kp2.score;
          if (c1 > confidence_threshold && c2 > confidence_threshold) {
            ctx.strokeStyle = "rgb(255, 0, 0)"; // 빨간색
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            bad -= 5;
          }
        }
      } else {
        for (let [key, value] of Object.entries(edges)) {
          let p = key.split(",");
          let p1 = parseInt(p[0]);
          let p2 = parseInt(p[1]);
          let kp1 = poses[0].keypoints[p1];
          let kp2 = poses[0].keypoints[p2];
          let x1 = kp1.x * widthRatio;
          let y1 = kp1.y * heightRatio;
          let c1 = kp1.score;
          let x2 = kp2.x * widthRatio;
          let y2 = kp2.y * heightRatio;
          let c2 = kp2.score;
          if (c1 > confidence_threshold && c2 > confidence_threshold) {
            ctx.strokeStyle = "rgb(0, 255, 0)"; // 초록색
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }
    }
  };

  // 스쿼트 카운트 함수
  let countSquats = () => {
    let kneeKeypointsConfident = poses[0].keypoints
      .slice(10, 16)
      .every((kp) => kp.score > confidence_threshold);
    if (kneeKeypointsConfident) {
      let leftHip = poses[0].keypoints[11];
      let rightHip = poses[0].keypoints[12];
      let leftKnee = poses[0].keypoints[13];
      let rightKnee = poses[0].keypoints[14];
      let leftAnkle = poses[0].keypoints[15];
      let rightAnkle = poses[0].keypoints[16];
      let leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      let rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
      if (
        !squatStarted &&
        leftKneeAngle <= kneeAngleThreshold &&
        rightKneeAngle <= kneeAngleThreshold
      ) {
        squatStarted = true;
        squatFinished = false;
      }

      // 스쿼트 시작 및 카운트
      if (
        squatStarted &&
        leftKneeAngle > kneeAngleThreshold &&
        rightKneeAngle > kneeAngleThreshold
      ) {
        setSquatCount((prevCount) => prevCount + 1);
        squatStarted = false;
        squatFinished = true;
      }

      // 스쿼트 할때마다 몇회 완료 출력
      if (squatCount > 0 && squatFinished) {
        console.log(`스쿼트 ${squatCount}회 완료!`);
        squatFinished = false;
      }
      // 스쿼트 종료
      if (squatCount === repsPerSet) {
        // 사용할 데이터를 객체에 담기
        let data = {
          realCount: squatCount,
          realSet: currentSet,
          realTime: timer,
          weight: we, // 이상한 곳
          score: bad,
          plan: plan,
          startTime: startTime,
          limitTime: limitTime,
        };

        // axios.post() 요청 보내기
        axios
          .post(
            "/api/sets",
            { ExerciseSetDTO: data },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  // 각도 계산
  let calculateAngle = (p1, p2, p3) => {
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

  return (
    <div id="container">
      <div id="state">
        <div id="shapeContainer">
          {Array.from({ length: totalSets }, (_, index) => (
            <div
              key={index}
              className={index < currentSet ? "shape completed" : "shape"}
            ></div>
          ))}
        </div>
        <div>타이머: {timer}초</div>
        <div>스쿼트 카운트: {squatCount}</div>
        <div>Pose 감지 상태: {isPoseDetected ? "감지됨" : "감지 안됨"}</div>
      </div>
      <div id="module">
        <video
          id="webcam"
          ref={videoRef}
          width="900"
          height="700"
          autoPlay
          muted
        ></video>
        <canvas
          id="movenet_Canvas"
          ref={canvasRef}
          width="900"
          height="700"
        ></canvas>
      </div>
    </div>
  );
};

export default SquatExec;
