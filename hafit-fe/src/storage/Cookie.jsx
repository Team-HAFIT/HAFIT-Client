// setRefreshToken : Refresh Token을 Cookie에 저장하기 위한 함수
// getCookieToken : Cookie에 저장된 Refresh Token 값을 갖고 오기 위한 함수
// removeCookieToken : Cookie 삭제를 위한 함수. 로그아웃 시 사용할 예정

/** 
 * 2023. 06. 09 (금)
 * 백엔드 refreshToken 발급 로직 변경으로 인해 비활성화
 * (기존) header에 실어 보냄 -> (변경 후) Cookie에 실어 보냄
 * --> 프론트에서 따로 처리해주지 않아도 되도록 변경되었습니다.
*/ 

import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setRefreshToken = (refreshToken) => {
  const today = new Date();
  const expireDate = today.setDate(today.getDate() + 7);

  return cookies.set("Authorization-refresh", refreshToken, {
    sameSite: "strict",
    path: "/",
    expires: new Date(expireDate),
  });
};

export const getCookieToken = () => {
  return cookies.get("Authorization-refresh");
};

export const removeCookieToken = () => {
  return cookies.remove("Authorization-refresh", { sameSite: "strict", path: "/" });
};
