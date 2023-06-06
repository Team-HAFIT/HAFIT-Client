// 정상적인 응답이 왔을 경우 removeCookieToken를 통해 Cookie에 저장된 Refresh Token 정보와
// dispatch()를 통해 store에 저장된 Access Token 정보를 모두 삭제
// Cookie와 store에서 데이터를 모두 삭제한 후 홈으로 이동
// 로그아웃에 대한 요청은 해당 컴포넌트 요청 후 한 번만 실행되면 되기 때문에 useEffect 훅을 사용, deps를 비워 두었음

import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getCookieToken, removeCookieToken } from "../storage/Cookie";
import { DELETE_TOKEN } from "../store/Auth";
import { logoutUser } from "../api/Users";

function Logout() {
  // store에 저장된 Access Token 정보를 받아 온다
  const { accessToken } = useSelector((state) => state.token);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Cookie에 저장된 Refresh Token 정보를 받아 온다
  const refreshToken = getCookieToken();

  const logout = useCallback(async () => {
    const data = await logoutUser({ refresh_token: refreshToken }, accessToken);

    if (data.status) {
      dispatch(DELETE_TOKEN());
      removeCookieToken();
      navigate("/login");
    } else {
      window.location.reload();
    }
  }, [accessToken, dispatch, navigate, refreshToken]);

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
