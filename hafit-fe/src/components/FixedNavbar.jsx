import React from "react";
import { Menu, Avatar, Dropdown } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

import { removeCookieToken } from "../storage/Cookie";
import { DELETE_TOKEN } from "../store/Auth";

import "../styles/components/fixedNavbar.css";

function FixedHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goToUserInfo = () => {
    navigate(`/user/info`);
  };

  const handleLogout = () => {
    dispatch(DELETE_TOKEN());
    removeCookieToken();
    return navigate("/");
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={goToUserInfo}>
        내 프로필
      </Menu.Item>
      <Menu.Item key="2" onClick={goToUserInfo}>
        내 정보 수정
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        로그아웃
      </Menu.Item>
    </Menu>
  );

  return (
    <Menu
      mode="horizontal"
      theme="light"
      className="navbar"
      selectedKeys={[location.pathname === "/" ? "/main" : location.pathname]}
      style={{
        backgroundColor: "black",
        display: "flex",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: "1",
        width: "100%",
      }}
    >
      <div key="/main">
        <Link to="/main">
          <p className="logo">Hafit</p>
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
        <Menu.Item key="/community/main" className="group-menu desktop-only">
          <Link to="/community/main" className="nav-menu">
            커뮤니티
          </Link>
        </Menu.Item>
        <Menu.Item key="/admin/ManagementPage" className="group-menu desktop-only">
          <Link to="/admin/management" className="nav-menu">
            회원관리
          </Link>
        </Menu.Item>
      </React.Fragment>

      {/* 모바일에서는 '모바일 메뉴1'과 '모바일 메뉴2'가 소개와 공지사항을 대체합니다. */}
      {/* <React.Fragment>
        <Menu.Item key="mobile-menu-replace" className="group-menu mobile-only">
          <Link to="/main">모바일 메뉴1</Link>
        </Menu.Item>
        <Menu.Item
          key="mobile-menu2-replace"
          className="group-menu mobile-only"
        >
          <Link to="/calendar">모바일 메뉴2</Link>
        </Menu.Item>
      </React.Fragment> */}
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

export default FixedHeader;
