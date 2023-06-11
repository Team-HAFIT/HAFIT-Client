import { UserOutlined, CommentOutlined, HomeOutlined } from "@ant-design/icons";
import { FiEdit3 } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import { IoMdNotifications } from "react-icons/io";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import {
  Layout,
  Menu,
  theme,
  Avatar,
  List,
  Badge,
  Divider,
  Button,
} from "antd";
import VirtualList from "rc-virtual-list";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";

import { removeCookieToken } from "../../storage/Cookie";
import { DELETE_TOKEN } from "../../store/Auth";

import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import SwiperCore, { Navigation, Pagination } from "swiper";

// Import Swiper styles
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import FixedHeader from "../../components/FixedNavbar";
import "../../styles/pages/community/viewPostsAll.css";

import LikeButton from "../../components/buttons/LikeBtn";

const fakeDataUrl =
  "https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo";
const ContainerHeight = 1200;

const { Content, Footer, Sider } = Layout;

const ViewPostsAll = () => {
  const accessToken = useSelector((state) => state.authToken.accessToken);
  const dispatch = useDispatch();

  //   --------- START : 게시글 무한 스크롤 ---------- //
  const [data, setData] = useState([]);
  const appendData = useCallback(() => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((body) => {
        setData((prevData) => prevData.concat(body.results));
        // message.success(`${body.results.length} more items loaded!`);
      });
  }, []);

  useEffect(() => {
    appendData();
  }, [appendData]);

  const onScroll = (e) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight
    ) {
      appendData();
    }
  };
  //   --------- END : 게시글 무한 스크롤 ---------- //

  // 수정 시작 ~~~!!!
  // --------- START : 게시글 정보 관련 ---------- //
  const [posts, setPosts] = useState([]);

  const getPosts = () => {
    axios
      .get("/api/posts", {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${accessToken}`,
        },
        timeout: 10000,
      })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.log(error);
        // 네트워크 오류로 인해 게시글을 불러오지 못했을 때, 임시 렌더링
        setPosts([
          {
            userId: 1,
            images: [
              "https://images.unsplash.com/photo-1684695414418-b76c47bfb731?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
              "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
              "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
              // "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
              "https://images.unsplash.com/photo-1684695414418-b76c47bfb731?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
              // "https://images.unsplash.com/photo-1684695414418-b76c47bfb731?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
              // "https://images.unsplash.com/photo-1684695414418-b76c47bfb731?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
            ],
            content:
              "네트워크 오류로 인해 게시글을 불러오지 못했습니다. 다시 시도해주세요.",
          },
        ]);
      });
  };

  useEffect(() => {
    getPosts();
  }, []);

  // 각 게시글 이미지 개수에 따른 렌더링 함수
  const renderImagesByPost = (post) => {
    if (post.images.length === 1) {
      return (
        <img
          className="post-image-only"
          width={272}
          alt="logo"
          src={post.images[0]}
        />
      );
    } else if (post.images.length === 2) {
      return (
        <>
          <img
            className="post-image"
            width={272}
            alt="logo"
            src={post.images[0]}
          />
          <img
            className="post-image"
            width={272}
            alt="logo"
            src={post.images[1]}
          />
        </>
      );
    } else if (post.images.length >= 3) {
      SwiperCore.use([Navigation, Pagination]);

      return (
        <Swiper
          slidesPerView={2}
          spaceBetween={30}
          navigation={{ clickable: true }}
          pagination={{ clickable: true }}
          className="mySwiper"
        >
          {post.images.map((image, index) => (
            <SwiperSlide key={index}>
              <img width={272} alt="slide" src={image} />
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }
  };
  // --------- END : 게시글 정보 관련 ---------- //

  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
              />
              <div style={{ paddingBottom: "4px" }}>
                <div style={{ margin: "0 0 4px 16px", marginBottom: "18px" }}>
                  <span
                    style={{
                      fontSize: "18px",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    김해핏
                  </span>{" "}
                  <FiEdit3 />
                </div>
                <span style={{ margin: "0 16px" }}>example@hafit.com</span>
              </div>
            </div>
            <Divider style={{ color: "white", borderColor: "#9999996c" }} />
            <Menu.Item key="1">
              <HomeOutlined />
              HOME
            </Menu.Item>
            <Menu.Item key="2">
              <GoSearch />
              검색
            </Menu.Item>
            <Menu.Item key="3">
              <UserOutlined />
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
                <Menu.Item key="all-posts">전체글 보기</Menu.Item>
                <Menu.Item key="fotd">오운완</Menu.Item>
                <Menu.Item key="feedback">자세 피드백</Menu.Item>
                <Menu.Item key="qna">운동 Q&amp;A</Menu.Item>
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
                  <span>글쓰기</span>
                </Menu.Item>
              </div>
            </Menu>
          </div>
          {/* <div className="testoffset">
            <p>adfsasfdasfdfadssdfafsd adsfasdfasd adsfads.</p>
        </div> */}
          <Content className="testoffset">
            <div
              style={{
                padding: 24,
                textAlign: "center",
                background: "#e7e7e7",
                borderRadius: "12px",
              }}
            >
              {/* 게시글 무한 스크롤 */}
              <List>
                <VirtualList
                  data={data}
                  height={ContainerHeight}
                  itemHeight={47}
                  itemKey="email"
                  onScroll={onScroll}
                >
                  {(item) => (
                    <div
                      style={{
                        background: colorBgContainer,
                        marginBottom: "8px",
                        borderRadius: "8px",
                        padding: "8px 8px 24px 8px",
                        minHeight: "12rem",
                      }}
                    >
                      <div style={{ display: "block", margin: "0 24px" }}>
                        <div>
                          <List.Item
                            key={item.email}
                            style={{ paddingBottom: "4px" }}
                          >
                            <List.Item.Meta
                              style={{ display: "flex", textAlign: "left" }}
                              avatar={
                                <Avatar
                                  src={item.picture.large}
                                  style={{ width: "48px", height: "48px" }}
                                />
                              }
                              title={
                                <a href="https://ant.design">
                                  {item.name.last}
                                </a>
                              }
                              description="2023. 05. 18 - 20:24"
                            />
                            <HiOutlineDotsHorizontal
                              style={{
                                fontSize: "28px",
                                color: "#999999",
                                alignSelf: "self-start",
                              }}
                            />
                          </List.Item>
                        </div>
                        <Divider style={{ margin: "0 0 16px 0" }} />
                        <p className="post-content-p">
                          <span className="post-content-text">
                            동해물과 백두산이 마르고 닳도록 하느님이 보우하사
                            우리 나라 만세
                          </span>
                        </p>
                        <p className="post-content-p">
                          <span className="post-content-text">
                            #무궁화 #삼천리 #화려강산 #대한사람 #대한으로 #길이
                            #보전하세
                          </span>
                        </p>

                        {/* 게시글 이미지 렌더링 */}
                        <div>
                          {posts.map((post, index) => (
                            <article key={index} className="image-container">
                              {renderImagesByPost(post)}
                            </article>
                          ))}
                        </div>

                        {/* 아래 주석 처리된 코드는 테스트 용도 */}
                        {/* <article
                          className="image-container"
                          style={{
                            height: "100%",
                            maxHeight: "24rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "4px auto",
                          }}
                        >
                          <Swiper
                            slidesPerView={2}
                            spaceBetween={30}
                            navigation={true}
                            pagination={{
                              clickable: true,
                            }}
                            modules={[Navigation, Pagination]}
                            className="mySwiper"
                          >
                            <SwiperSlide>
                              <img
                                width={272}
                                alt="logo"
                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                              />
                            </SwiperSlide>
                            <SwiperSlide>
                              <img
                                width={272}
                                alt="logo"
                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                              />
                            </SwiperSlide>
                            <SwiperSlide>
                              <img
                                width={272}
                                alt="logo"
                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                              />
                            </SwiperSlide>
                          </Swiper>
                          <img
                            className="post-image"
                            width={272}
                            alt="logo"
                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                          />
                          <img
                            className="post-image"
                            width={272}
                            alt="logo"
                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                          /> 
                        </article> */}
                        <div
                          style={{
                            display: "flex",
                            textAlign: "left",
                            marginTop: "12px",
                          }}
                        >
                          {/* <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginRight: "8px",
                            }}
                          >
                            <HiOutlineHeart
                              style={{
                                fontSize: "2.1em",
                                marginRight: "4px",
                                color: "#999999",
                              }}
                            />
                            <span
                              style={{
                                fontSize: "16px",
                                color: "#999999",
                                marginRight: "40px",
                              }}
                            >
                              10
                            </span>
                          </div> */}
                          <div style={{ marginRight: "16px" }}>
                            <LikeButton />
                          </div>

                          <Button
                            shape="round"
                            style={{
                              height: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "4px 12px",
                            }}
                            icon={
                              <CommentOutlined
                                style={{
                                  fontSize: "1.8em",
                                  color: "#999999",
                                }}
                              />
                            }
                          >
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "500",
                                color: "#999999",
                              }}
                            >
                              2
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </VirtualList>
              </List>
            </div>
          </Content>
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
export default ViewPostsAll;
