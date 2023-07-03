import { Outlet, Link, useLocation } from "react-router-dom";

import { UserOutlined, HomeOutlined } from "@ant-design/icons";
import { FiEdit3 } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import { IoMdNotifications } from "react-icons/io";
import { IoCreateOutline } from "react-icons/io5";
import { Layout, Menu, Avatar, List, Badge, Divider, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import SwiperCore, { Navigation, Pagination } from "swiper";

// Import Swiper styles
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import FixedHeader from "../../components/FixedNavbar";
import "../../styles/pages/community/viewPostsAll.css";

import PostModal from "../../pages/community/modal/PostModal";

SwiperCore.use([Navigation, Pagination]);

const { Content, Footer, Sider } = Layout;

const CommunityLayout = () => {
  const location = useLocation();

  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 여부 상태값

  const accessToken = useSelector((state) => state.authToken.accessToken);
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    axios
      .get("/api/my", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        timeout: 5000,
      })
      .then((response) => {
        console.log(response.data);
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [accessToken]);

  useEffect(() => {
    const navbarScroll = () => {
      const y = window.scrollY;
      const testnavbar = document.querySelector(".testnavbar");

      if (y > 10) {
        testnavbar.classList.add("small");
      } else {
        testnavbar.classList.remove("small");
      }
    };
    window.addEventListener("scroll", navbarScroll);

    return () => {
      window.removeEventListener("scroll", navbarScroll);
    };
  }, []);

  return (
    <Layout>
      <FixedHeader />
      <Layout hasSider>
        <Sider
          width={280}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 60,
            bottom: 0,
            padding: "24px 8px",
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            // items={items}
          >
            <div
              className="user-info"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "16px 0 24px 0",
              }}
            >
              <Avatar
                className="user-avatar"
                size={64}
                shape="circle"
                icon={<UserOutlined />}
                src={userInfo.imageUrl}
              />
              <div style={{ paddingBottom: "4px" }}>
                <div style={{ margin: "0 0 4px 16px", marginBottom: "18px" }}>
                  <span
                    style={{
                      fontSize: "18px",
                      color: "white",
                      fontWeight: "600",
                      marginRight: "4px",
                    }}
                  >
                    {userInfo.name}
                  </span>{" "}
                  <Link to="/user/info">
                    <FiEdit3 style={{ fontSize: "16px" }} />
                  </Link>
                </div>
                <span style={{ margin: "0 16px" }}>{userInfo.email}</span>
              </div>
            </div>
            <Divider style={{ color: "white", borderColor: "#9999996c" }} />
            <Menu.Item key="1">
              <HomeOutlined style={{ marginRight: "8px" }} />
              HOME
            </Menu.Item>
            <Menu.Item key="2">
              <GoSearch style={{ marginRight: "8px" }} />
              검색
            </Menu.Item>
            <Menu.Item key="3">
              <UserOutlined style={{ marginRight: "8px" }} />
              마이페이지
            </Menu.Item>
            <Divider style={{ color: "white", borderColor: "#9999996c" }} />
            <React.Fragment>
              <List
                size="small"
                // dataSource={data}
                // renderItem={(item) => <List.Item>{item}</List.Item>}
              >
                <List.Item className="sider-sub-menu">
                  좋아요 표시한 글
                </List.Item>
                <List.Item className="sider-sub-menu">내가 작성한 글</List.Item>
                <List.Item className="sider-sub-menu">내 작성 댓글</List.Item>
              </List>
            </React.Fragment>
          </Menu>
        </Sider>
        <Layout
          className="site-layout"
          style={{
            marginLeft: 280,
          }}
        >
          <div className="testnavbar">
            <Menu
              mode="horizontal"
              selectedKeys={[
                location.pathname === "/community/main"
                  ? "/community/posts-all"
                  : location.pathname,
              ]}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                height: "100%",
                maxHeight: "40px",
                padding: "0 8px",
                margin: "0",
                backgroundColor: "inherit",
                borderRadius: "12px",
              }}
            >
              <div style={{ display: "flex" }}>
                <Menu.Item key="/community/posts-all">
                  <Link to="/community/posts-all">전체글 보기</Link>
                </Menu.Item>
                <Menu.Item key="/community/fotd">
                  <Link to="/community/fotd">오운완</Link>
                </Menu.Item>
                <Menu.Item key="/community/feedback">
                  <Link to="/community/feedback">자세 피드백</Link>
                </Menu.Item>
                <Menu.Item key="/community/qna">
                  <Link to="/community/qna">운동 Q&amp;A</Link>
                </Menu.Item>
                <Menu.Item key="/community/freeboard">
                  <Link to="/community/freeboard">자유게시판</Link>
                </Menu.Item>
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  height: "100%",
                }}
              >
                <Menu.Item key="search">
                  <GoSearch style={{ fontSize: "18px" }} />
                </Menu.Item>
                <Menu.Item key="notification">
                  {/* <Badge count={99} overflowCount={10} size="small" style={{ display: "flex", padding: "0 4px", maxWidth: "28px", justifyContent: "center", }}> */}
                  <Badge dot="true">
                    <IoMdNotifications
                      style={{ fontSize: "20px", color: "#d2d2d2" }}
                    />
                  </Badge>
                </Menu.Item>
                <Menu.Item
                  key="write-post"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Button
                    className="write-post-btn"
                    onClick={() => {
                      setModalVisible(true);
                    }}
                    icon={
                      <IoCreateOutline
                        style={{
                          fontSize: "1.4em",
                          color: "white",
                          marginRight: "2px",
                        }}
                      />
                    }
                  >
                    <span className="write-post-btn-text">글쓰기</span>
                  </Button>
                  <PostModal
                    visible={modalVisible}
                    setModalVisible={setModalVisible}
                  />
                </Menu.Item>
              </div>
            </Menu>
          </div>
          {/* START :: 게시글 리스트 */}
          <Content className="testoffset">
            {/* Outlet: 게시글 리스트가 렌더링 되는 공간 */}
            <Outlet />
          </Content>
          {/* END :: 게시글 리스트 */}
          <Footer
            style={{
              textAlign: "center",
            }}
          >
            Ant Design ©2023 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default CommunityLayout;
