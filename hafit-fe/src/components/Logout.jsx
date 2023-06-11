// 2023. 06. 12
// 미사용 컴포넌트 입니다. (임시)
// 사유: 서버 로그아웃 미구현

import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { removeCookieToken } from "../storage/Cookie";
import { DELETE_TOKEN } from "../store/Auth";
// import { logoutUser } from "../api/Users";

function Logout() {
  // store에 저장된 Access Token 정보를 받아 옴
  // const { accessToken } = useSelector((state) => state.authToken);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Cookie에 저장된 Refresh Token 정보를 받아 옴
  // const refreshToken = getCookieToken();

  // 서버 로그아웃 미구현으로 인한 주석 처리 (임시)
  // const logout = useCallback(async () => {
  //   const data = await logoutUser(refreshToken, accessToken);

  //   if (data.status) {
  //     dispatch(DELETE_TOKEN());
  //     console.log('로그아웃 성공');
  //     removeCookieToken();
  //     navigate("/login");
  //   } else {
  //     console.log('로그아웃 실패');
  //     window.location.reload();
  //   }
  // }, [accessToken, dispatch, navigate, refreshToken]);

  // 테스트용 임시 로그아웃 함수
  const logout = useCallback(async () => {
    dispatch(DELETE_TOKEN());
    removeCookieToken();
    return navigate("/login");
  }, [dispatch, navigate]);

  // 해당 컴포넌트가 요청된 후 한 번만 실행되면 되기 때문에 useEffect 훅을 사용
  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <>
      <Link to="/login" />
    </>
  );
}

export default Logout;
