import { CommentOutlined } from "@ant-design/icons";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import {
  theme,
  Avatar,
  List,
  Divider,
  Button,
} from "antd";
import VirtualList from "rc-virtual-list";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { useSelector } from "react-redux";
// import jwt_decode from "jwt-decode";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";

// Import Swiper styles
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "../../../styles/pages/community/viewPostsAll.css";

import LikeButton from "../../../components/buttons/LikeBtn";

SwiperCore.use([Navigation, Pagination]);

const fakeDataUrl = "https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo";
const ContainerHeight = 1200;

const PostsAll = () => {
  const accessToken = useSelector((state) => state.authToken.accessToken);

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

  // --------- START : 게시글 정보 관련 ---------- //
  const [posts, setPosts] = useState([]);

  const getPosts = useCallback(() => {
    axios
      .get("/api/post", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
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
  }, [accessToken, setPosts]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  // 각 게시글 이미지 개수에 따른 렌더링 함수
  const renderImagesByPost = (post) => {
    if (!post?.images || post.images.length === 0) {
      return null;
    }
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
      // SwiperCore.use([Navigation, Pagination]);

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

  return (
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
                  <List.Item key={item.email} style={{ paddingBottom: "4px" }}>
                    <List.Item.Meta
                      style={{ display: "flex", textAlign: "left" }}
                      avatar={
                        <Avatar
                          src={item.picture.large}
                          style={{ width: "48px", height: "48px" }}
                        />
                      }
                      title={<a href="https://ant.design">{item.name.last}</a>}
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
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </span>
                </p>
                <p className="post-content-p">
                  <span className="post-content-text">
                    #무궁화 #삼천리 #화려강산 #대한사람 #대한으로 #길이
                    #보전하세
                  </span>
                </p>

                <div>
                  {Array.from(posts).map((post, index) => (
                    <article key={index} className="image-container">
                      {renderImagesByPost(post)}
                    </article>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    textAlign: "left",
                    marginTop: "12px",
                  }}
                >
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
  );
};

export default PostsAll;
