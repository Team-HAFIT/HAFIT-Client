import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { FiHeart } from "react-icons/fi";
import { Layout, Menu, theme, Avatar, List } from "antd";
import VirtualList from "rc-virtual-list";
import React, { useEffect, useState, useCallback } from "react";

import FixedHeader from "../../components/FixedNavbar";

import "../../styles/pages/community/viewPostsAll.css";

const fakeDataUrl =
  "https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo";
const ContainerHeight = 800;

const { Content, Footer, Sider } = Layout;
const items = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));

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
            items={items}
          />
        </Sider>
        <Layout
          className="site-layout"
          style={{
            marginLeft: 280,
          }}
        >
          <div className="testnavbar">
            {/* <h1 className="testlogo"></h1> */}
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
              margin: "0 auto",
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
                        padding: "16px",
                        minHeight: "16rem",
                      }}
                    >
                      <List.Item
                        key={item.email}
                        style={{ display: "block", margin: "0 24px" }}
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
                            <a href="https://ant.design">{item.name.last}</a>
                          }
                          description="2023. 05. 18 - 20:24"
                        />
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
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginRight: "8px",
                            }}
                          >
                            <FiHeart
                              style={{
                                fontSize: "1.8em",
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
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginRight: "40px",
                            }}
                          >
                            <CommentOutlined
                              style={{
                                fontSize: "1.8em",
                                marginRight: "6px",
                                color: "#999999",
                              }}
                            />
                            <span
                              style={{ fontSize: "16px", color: "#999999" }}
                            >
                              2
                            </span>
                          </div>
                        </div>
                      </List.Item>
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
