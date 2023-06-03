import React from "react";
import { Link } from "react-router-dom";

function OAuthTest() {
  return (
    <div>
        {/* <MainHeader /> */}
        <div>
            <Link to="http://172.26.21.193:8080/oauth2/authorization/kakao">카카오 로그인</Link>
            <Link to="http://172.26.21.193:8080/oauth2/authorization/google">구글 로그인</Link>
            <Link to="http://172.26.21.193:8080/oauth2/authorization/naver">네이버 로그인</Link>
        </div>     
    </div>
  );
}

export default OAuthTest;
