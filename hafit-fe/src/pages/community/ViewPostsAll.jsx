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

import FixedHeader from "../../components/FixedNavbar";
import "../../styles/pages/community/viewPostsAll.css";

// 수정 시작 ~~~~~~~~
import LikeButton from "../../components/buttons/LikeBtn";

const fakeDataUrl =
  "https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo";
const ContainerHeight = 1200;

const { Content, Footer, Sider } = Layout;

const ViewPostsAll = () => {
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
                size={64}
                shape="circle"
                icon={<UserOutlined />}
                style={{
                  backgroundColor: "rgb(108, 0, 240)",
                  color: "#f56a00",
                }}
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
                <List.Item style={{ color: "#bcbcbc" }}>
                  좋아요 표시한 글
                </List.Item>
                <List.Item style={{ color: "#bcbcbc" }}>
                  내가 작성한 글
                </List.Item>
                <List.Item style={{ color: "#bcbcbc" }}>내 작성 댓글</List.Item>
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
          <Content
            className="testoffset"
            style={{
              overflow: "initial",
              width: "100%",
              maxWidth: "876px",
              margin: "24px auto",
            }}
          >
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
                        minHeight: "16rem",
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
                        <p
                          style={{
                            textAlign: "left",
                            margin: 0,
                            padding: "2px 6px",
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>
                            동해물과 백두산이 마르고 닳도록 하느님이 보우하사
                            우리 나라 만세
                          </span>
                        </p>
                        <p
                          style={{
                            textAlign: "left",
                            margin: 0,
                            padding: "2px 6px",
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>
                            #무궁화 #삼천리 #화려강산 #대한사람 #대한으로 #길이
                            #보전하세
                          </span>
                        </p>
                        <article
                          style={{
                            height: "18rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "8px auto",
                          }}
                        >
                          <img
                            style={{
                              minWidth: "26em",
                              width: "auto",
                              height: "100%",
                              margin: "8px 8px",
                              borderRadius: "8px",
                            }}
                            width={272}
                            alt="logo"
                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                          />
                          {/* <img
                            style={{
                              minWidth: "26em",
                              width: "auto",
                              height: "100%",
                              margin: "8px 8px",
                              borderRadius: "8px",
                            }}
                            width={272}
                            alt="logo"
                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                          /> */}
                        </article>
                        <div
                          style={{
                            display: "flex",
                            textAlign: "left",
                            marginTop: "24px",
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
