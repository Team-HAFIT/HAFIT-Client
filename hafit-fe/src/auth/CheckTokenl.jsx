import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getCookieToken, removeCookieToken } from "../storage/Cookie";
import { requestToken } from "../api/Users";
import { DELETE_TOKEN, SET_TOKEN } from "../store/Auth";

export function CheckToken(key) {
  const [isAuth, setIsAuth] = useState("Loaded");
  const { authenticated, expireTime, accessToken } = useSelector((state) => state.authToken);
  const refreshToken = getCookieToken();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthToken = async () => {
      if (refreshToken === undefined) {
        dispatch(DELETE_TOKEN());
        setIsAuth("Failed");
      } else {
        if (authenticated && new Date().getTime() < expireTime) {
          setIsAuth("Success");
        } else {
          const response = await requestToken(refreshToken);

          if (response.status) {
            const token = response.accessToken;
            dispatch(SET_TOKEN(token));
            setIsAuth("Success");
          } else {
            dispatch(DELETE_TOKEN());
            removeCookieToken();
            setIsAuth("Failed");
          }
        }
      }
    };

    checkAuthToken();
  }, [dispatch, refreshToken, authenticated, expireTime]);

  useEffect(() => {
    if (accessToken === null) {
      const requestTokenAndSetAuth = async () => {
        const response = await requestToken(refreshToken);

        if (response.status) {
          const token = response.accessToken;
          dispatch(SET_TOKEN(token));
          setIsAuth("Success");
        } else {
          dispatch(DELETE_TOKEN());
          removeCookieToken();
          setIsAuth("Failed");
        }
      };

      requestTokenAndSetAuth();
    }
  }, [dispatch, refreshToken, accessToken]);

  return {
    isAuth,
  };
}
