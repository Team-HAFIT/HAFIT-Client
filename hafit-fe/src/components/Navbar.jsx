import React from "react";
import { Menu, Button } from "antd";
import { Link } from "react-router-dom";

import "../styles/navbar.css";

import Logo from "../assets/img/testlogo.jpg";

function Header() {
  return (
    <Menu mode="horizontal" theme="light" className="navbar" defaultSelectedKeys={['intro']}>
      <div key="logo">
        <Link to="/" >
            <img src={Logo} alt="로고" className="logo" />
        </Link>
      </div>

      {/* 데스크톱에서는 '소개'와 '공지사항'을 보여줍니다. */}
      <React.Fragment>
        <Menu.Item key="intro" className="group-menu desktop-only">
          <Link to="/intro" className="nav-menu">소개</Link>
        </Menu.Item>
        <Menu.Item key="notice" className="group-menu desktop-only">
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

      <Menu.Item key="login" style={{ marginLeft: "auto" }}>
        <Button type="ghost">
          <Link to="/login" className="nav-menu">로그인</Link>
        </Button>
      </Menu.Item>

      <Menu.Item key="join" style={{ marginLeft: "10px" }}>
        <Button type="ghost">
          <Link to="/join" className="nav-menu">회원가입</Link>
        </Button>
      </Menu.Item>
    </Menu>
  );
};

export default Header;