import React from "react";
import { Menu, Dropdown, Avatar } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

import "../styles/components/navbar.css";

import Logo from "../assets/img/testlogo.jpg";

function MainHeader() {
  // 2023. 5. 4. 화요일 - 12:50
  // 현재 페이지의 경로를 가져와, 해당 경로에 맞는 메뉴를 강조 표시해주기 위한 useLocation hook 추가
  // root 경로일 때, default로 /intro를 선택하도록 설정하였음. (16:62)
  const location = useLocation();

  const menu = (
    <Menu>
      <Menu.Item key="1">내 프로필</Menu.Item>
      <Menu.Item key="2">내 정보 수정</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">로그아웃</Menu.Item>
    </Menu>
  );

  return (
    <Menu
      mode="horizontal"
      theme="light"
      className="navbar"
      selectedKeys={[location.pathname === "/" ? "/main" : location.pathname]}
    >
      <div key="/">
        <Link to="/">
          <img src={Logo} alt="로고" className="logo" />
        </Link>
      </div>

      {/* 데스크톱에서는 '소개'와 '공지사항'을 보여줍니다. */}
      <React.Fragment>
        <Menu.Item key="/main" className="group-menu desktop-only">
          <Link to="/main" className="nav-menu">
            운동
          </Link>
        </Menu.Item>
        <Menu.Item key="/calendar" className="group-menu desktop-only">
          <Link to="/calendar" className="nav-menu">
            운동 일정
          </Link>
        </Menu.Item>
        <Menu.Item key="/stats" className="group-menu desktop-only">
          <Link to="/stats" className="nav-menu">
            운동 통계
          </Link>
        </Menu.Item>
        <Menu.Item key="/community" className="group-menu desktop-only">
          <Link to="/community" className="nav-menu">
            커뮤니티
          </Link>
        </Menu.Item>
      </React.Fragment>

      {/* 모바일에서는 '모바일 메뉴1'과 '모바일 메뉴2'가 소개와 공지사항을 대체합니다. */}
      <React.Fragment>
        <Menu.Item key="mobile-menu-replace" className="group-menu mobile-only">
          <Link to="/main">모바일 메뉴1</Link>
        </Menu.Item>
        <Menu.Item
          key="mobile-menu2-replace"
          className="group-menu mobile-only"
        >
          <Link to="/calendar">모바일 메뉴2</Link>
        </Menu.Item>
      </React.Fragment>

      <Menu.Item style={{ marginLeft: "auto", marginRight: "80px" }}>
        <Dropdown overlay={menu} trigger={["click"]}>
          <a
            href="/#"
            className="ant-dropdown-link"
            onClick={(e) => e.preventDefault()}
          >
            <Avatar
              size="large"
              icon={<UserOutlined style={{ fontSize: "22px" }} />}
              style={{ marginRight: "4px" }}
            />
            <DownOutlined style={{ fontSize: "14px" }} />
          </a>
        </Dropdown>
      </Menu.Item>
    </Menu>
  );
}

export default MainHeader;
