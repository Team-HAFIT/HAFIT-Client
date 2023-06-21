import React, { useEffect, useState } from "react";
import { Menu, Avatar, Dropdown } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import { removeCookieToken } from "../storage/Cookie";
import { DELETE_TOKEN } from "../store/Auth";

import "../styles/components/navbar.css";

function Header() {
  // 현재 페이지의 경로를 가져와, 해당 경로에 맞는 메뉴를 강조 표시해주기 위한 useLocation hook 추가
  // root 경로일 때, default로 /intro를 선택하도록 설정하였음. (16:62)
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authenticated = useSelector((state) => state.authToken.authenticated);

  // const isLoggedIn = true; // 테스트용
  const [isLoggedIn, setIsLoggedIn] = useState(authenticated); // 로그인 상태를 저장하는 state

  useEffect(() => {
    setIsLoggedIn(authenticated); // 가져온 값으로 isLoggedIn을 설정함
  }, [authenticated]); // mount 시 한 번 실행

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
    <>
      {isLoggedIn ? (
        <Menu
          mode="horizontal"
          theme="light"
          className="navbar"
          selectedKeys={[
            location.pathname === "/" ? "/main" : location.pathname,
          ]}
          style={{ backgroundColor: "black" }}
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
              <Link to="/prepare" className="nav-menu">
                운동 일정
              </Link>
            </Menu.Item>
            <Menu.Item key="/stats" className="group-menu desktop-only">
              <Link to="/prepare" className="nav-menu">
                운동 통계
              </Link>
            </Menu.Item>
            <Menu.Item
              key="/community/main"
              className="group-menu desktop-only"
            >
              <Link to="/community/main" className="nav-menu">
                커뮤니티
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
          <Menu.Item key="/exec/rest">
            <Link to="/exec/rest">...</Link>
          </Menu.Item>
          <Menu.Item style={{ marginLeft: "auto", marginRight: "80px" }}>
            <Dropdown overlay={menu} trigger={["hover"]}>
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
      ) : (
        <Menu
          mode="horizontal"
          theme="light"
          className="navbar"
          selectedKeys={[
            location.pathname === "/" ? "/intro" : location.pathname,
          ]}
          style={{ backgroundColor: "black" }}
        >
          <div key="/">
            <Link to="/">
              <p className="logo">Hafit</p>
            </Link>
          </div>

          {/* 데스크톱에서는 '소개'와 '공지사항'을 보여줍니다. */}
          <React.Fragment>
            <Menu.Item key="/intro" className="group-menu desktop-only">
              <Link to="/intro" className="nav-menu">
                소개
              </Link>
            </Menu.Item>
            <Menu.Item key="/notice" className="group-menu desktop-only">
              <Link to="/notice" className="nav-menu">
                공지사항
              </Link>
            </Menu.Item>
          </React.Fragment>

          {/* 모바일에서는 '모바일 메뉴1'과 '모바일 메뉴2'가 소개와 공지사항을 대체합니다. */}
          {/* <React.Fragment>
        <Menu.Item key="mobile-menu-replace" className="group-menu mobile-only">
          <Link to="/intro">모바일 메뉴1</Link>
        </Menu.Item>
        <Menu.Item key="mobile-menu2-replace" className="group-menu mobile-only">
          <Link to="/notice">모바일 메뉴2</Link>
        </Menu.Item>
      </React.Fragment> */}

          <React.Fragment>
            <Menu.Item key="/login" style={{ marginLeft: "auto" }}>
              <Link to="/login" className="nav-menu-user">
                로그인
              </Link>
            </Menu.Item>

            <Menu.Item key="/join" style={{ marginRight: "80px" }}>
              <Link to="/join" className="nav-menu-user">
                회원가입
              </Link>
            </Menu.Item>
          </React.Fragment>
        </Menu>
      )}
    </>
  );
}

export default Header;
