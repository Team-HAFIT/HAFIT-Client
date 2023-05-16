import axios from "axios";

const serverIP = "http://172.26.20.147:8080";

const apiInstance = axios.create({
  baseURL: serverIP,
  timeout: 1000, // 생성 제한 시간: 1초
  headers: { "Content-Type": "application/json" },
});

export default apiInstance;