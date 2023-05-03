import React from "react";
import { Menu, Button } from "antd";
import { Link, useLocation } from "react-router-dom";

import "../styles/navbar.css";

import Logo from "../assets/img/testlogo.jpg";

function Header() {
  // 2023. 5. 4. 화요일 - 12:50
  // 현재 페이지의 경로를 가져와, 해당 경로에 맞는 메뉴를 강조 표시해주기 위한 useLocation hook 추가
  // root 경로일 때, default로 /intro를 선택하도록 설정하였음. (16:62)
  const location = useLocation();

  return (
    <Menu mode="horizontal" theme="light" className="navbar" selectedKeys={[location.pathname === "/" ? "/intro" : location.pathname]}>
      <div key="/">
        <Link to="/" >
            <img src={Logo} alt="로고" className="logo" />
        </Link>
      </div>

      {/* 데스크톱에서는 '소개'와 '공지사항'을 보여줍니다. */}
      <React.Fragment>
        <Menu.Item key="/intro" className="group-menu desktop-only">
          <Link to="/intro" className="nav-menu">소개</Link>
        </Menu.Item>
        <Menu.Item key="/notice" className="group-menu desktop-only">
          <Link to="/notice" className="nav-menu">공지사항</Link>
        </Menu.Item>
      </React.Fragment>

      {/* 모바일에서는 '모바일 메뉴1'과 '모바일 메뉴2'가 소개와 공지사항을 대체합니다. */}
      <React.Fragment>
        <Menu.Item key="mobile-menu-replace" className="group-menu mobile-only">
          <Link to="/intro">모바일 메뉴1</Link>
        </Menu.Item>
        <Menu.Item key="mobile-menu2-replace" className="group-menu mobile-only">
          <Link to="/notice">모바일 메뉴2</Link>
        </Menu.Item>
      </React.Fragment>

      <Menu.Item key="/login" style={{ marginLeft: "auto" }}>
        <Button type="ghost">
          <Link to="/login" className="nav-menu">로그인</Link>
        </Button>
      </Menu.Item>

      <Menu.Item key="/join">
        <Button type="ghost">
          <Link to="/join" className="nav-menu">회원가입</Link>
        </Button>
      </Menu.Item>
    </Menu>
  );
};

export default Header;