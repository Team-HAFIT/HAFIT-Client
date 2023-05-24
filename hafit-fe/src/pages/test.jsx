import React, { useState } from "react";
import axios from "axios";

// import Header from "../components/Navbar";
import MainHeader from "../components/MainNavbar";

function Test() {
  const [user, setUser] = useState({
    USER_ID: "",
    USER_PW: "",
    USER_NAME: "",
    USER_NICKNAME: "",
    USER_TEL: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleButtonClick = () => {
    // 클릭 이벤트 핸들러 함수에서 성공 알림을 표시합니다.
    alert("수정되었습니다!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/update", user, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 5000, // 요청 제한 시간 설정
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <MainHeader />
      {/* <Header /> */}
      <form onSubmit={handleSubmit} method="post">
        <div>
          <label htmlFor="USER_ID">아이디</label>
          <input
            type="text"
            id="USER_ID"
            name="USER_ID"
            value={user.USER_ID}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="USER_PW">비밀번호</label>
          <input
            type="password"
            id="USER_PW"
            name="USER_PW"
            value={user.USER_PW}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="USER_NAME">이름</label>
          <input
            type="text"
            id="USER_NAME"
            name="USER_NAME"
            value={user.USER_NAME}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="USER_NICKNAME">닉네임</label>
          <input
            type="text"
            id="USER_NICKNAME"
            name="USER_NICKNAME"
            value={user.USER_NICKNAME}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="USER_TEL">전화번호</label>
          <input
            type="tel"
            id="USER_TEL"
            name="USER_TEL"
            value={user.USER_TEL}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit" onClick={handleButtonClick}>
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default Test;
