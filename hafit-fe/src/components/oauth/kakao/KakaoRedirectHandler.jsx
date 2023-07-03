import { Spin, message } from "antd";
import React, { useEffect } from "react";
import { useSetRecoilState, atom } from "recoil";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const userState = atom({
    key: "userState",
    default: null,
});

const KakaoRedirectHandler = () => {
  const setUser = useSetRecoilState(userState);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. 인가코드를 추출을 위해 url 주소를 파싱
    const url = new URL(window.location.href);
    // 2. url에서 인가코드 추출
    const code = url.searchParams.get("code");

    // 3. 추출한 인가코드를 이용해 토큰을 발급받는 요청
    axios.get(`/oauth/kakao?code=${code}`, {
        timeout: 5000, // 요청 제한 시간 설정
    })
    .then((res) => {
        // 4. 발급받은 토큰을 이용해 사용자 정보를 가져오는 요청
        localStorage.setItem("token", res.data.access_token); // 토큰을 로컬스토리지에 저장

        axios.get("/oauth/kakao/user", {
            headers: {
                // 토큰을 헤더에 담아서 전달
                Authorization: `Bearer ${res.data.access_token}`,
            },
            timeout: 5000, // 요청 제한 시간 설정
        })
        .then((res) => {
            setUser(res.data);
            window.location.href = '/main';
            // navigate("/main");
        })
        .catch((err) => {
            console.error("소셜 로그인 에러 :: 사용자 정보 가져오기 실패", err);
            message.error("소셜 로그인에 실패했습니다.");
            navigate("/login"); // 실패 시 로그인 페이지로 이동
        });
    })
    .catch((err) => {
        console.error("소셜 로그인 에러 :: 토큰 발급 실패", err);
        message.error("소셜 로그인에 실패했습니다.");
        navigate("/login"); // 실패 시 로그인 페이지로 이동
    });
  }, [navigate, setUser]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        background: "rgba(0, 0, 0, 0.05)",
        height: "calc(100vh - 50px)",
      }}
    >
      <Spin style={{ paddingBottom: "96px" }} />
    </div>
  );
};

export default KakaoRedirectHandler;
